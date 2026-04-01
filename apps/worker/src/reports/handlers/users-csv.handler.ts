import { Injectable, Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { PassThrough } from 'node:stream';
import { once } from 'node:events';
import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { DomainError, ERROR_CODES, getTraceId } from '@repo/shared';
import { JobHandler } from '../ports/job-handler.port';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersCsvHandler implements JobHandler {
  readonly name = 'USERS_CSV';
  private readonly logger = new Logger(UsersCsvHandler.name);

  constructor(private readonly prisma: PrismaService) {}

  private escapeCsv(value: string): string {
    if (/[,"\n\r]/.test(value)) {
      return `"${value.replace(/"/g, '""')}"`;
    }

    return value;
  }

  private getStorageTarget(): {
    provider: 'aws-s3' | 'minio';
    bucket: string;
    client: S3Client;
  } {
    const bucket = process.env.S3_BUCKET?.trim();
    const region = process.env.AWS_REGION?.trim() || 'ap-southeast-1';
    const endpoint = process.env.S3_ENDPOINT?.trim();
    const accessKeyId =
      process.env.S3_ACCESS_KEY?.trim() ||
      process.env.AWS_ACCESS_KEY_ID?.trim();
    const secretAccessKey =
      process.env.S3_SECRET_KEY?.trim() ||
      process.env.AWS_SECRET_ACCESS_KEY?.trim();

    if (!bucket) {
      throw new DomainError(
        ERROR_CODES.REPORTS_STORAGE_CONFIG_INVALID,
        'Missing S3_BUCKET',
        { bucket: false },
      );
    }

    const s3Config: ConstructorParameters<typeof S3Client>[0] = {
      region,
    };

    if (endpoint) {
      s3Config.endpoint = endpoint;
      s3Config.forcePathStyle =
        (process.env.S3_FORCE_PATH_STYLE ?? 'true') === 'true';

      if (!accessKeyId || !secretAccessKey) {
        throw new DomainError(
          ERROR_CODES.REPORTS_STORAGE_CONFIG_INVALID,
          'Custom S3 endpoint requires S3_ACCESS_KEY and S3_SECRET_KEY',
          {
            accessKeyId: !!accessKeyId,
            secretAccessKey: !!secretAccessKey,
          },
        );
      }

      s3Config.credentials = {
        accessKeyId,
        secretAccessKey,
      };

      return {
        provider: 'minio',
        bucket,
        client: new S3Client(s3Config),
      };
    }

    return {
      provider: 'aws-s3',
      bucket,
      client: new S3Client(s3Config),
    };
  }

  private buildDateFilter(
    dateRaw: string | null,
    fromRaw: string | null,
    toRaw: string | null,
  ) {
    const parseYmd = (value: string, fieldName: string) => {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        throw new DomainError(
          ERROR_CODES.REPORTS_INVALID_FILTER,
          `Invalid ${fieldName} filter: ${value}`,
          { fieldName, value },
        );
      }

      const parsed = new Date(`${value}T00:00:00.000Z`);
      if (Number.isNaN(parsed.getTime())) {
        throw new DomainError(
          ERROR_CODES.REPORTS_INVALID_FILTER,
          `Invalid ${fieldName} filter: ${value}`,
          { fieldName, value },
        );
      }

      return parsed;
    };

    const from = typeof fromRaw === 'string' ? fromRaw.trim() : '';
    const to = typeof toRaw === 'string' ? toRaw.trim() : '';
    const legacyDateRaw = typeof dateRaw === 'string' ? dateRaw.trim() : '';

    if ((from || to) && legacyDateRaw) {
      throw new DomainError(
        ERROR_CODES.REPORTS_INVALID_FILTER,
        'Use either date or from/to filters, not both',
        {
          date: legacyDateRaw,
          from,
          to,
        },
      );
    }

    if (!from && !to && !legacyDateRaw) {
      return {};
    }

    if (legacyDateRaw) {
      const from = parseYmd(legacyDateRaw, 'date');
      const toExclusive = new Date(from);
      toExclusive.setUTCDate(toExclusive.getUTCDate() + 1);

      return {
        createdAt: {
          gte: from,
          lt: toExclusive,
        },
      };
    }

    const createdAt: {
      gte?: Date;
      lt?: Date;
    } = {};

    if (from) {
      createdAt.gte = parseYmd(from, 'from');
    }

    if (to) {
      const toStart = parseYmd(to, 'to');
      const toExclusive = new Date(toStart);
      toExclusive.setUTCDate(toExclusive.getUTCDate() + 1);
      createdAt.lt = toExclusive;
    }

    if (createdAt.gte && createdAt.lt && createdAt.gte >= createdAt.lt) {
      throw new DomainError(
        ERROR_CODES.REPORTS_INVALID_FILTER,
        'Invalid range: from must be <= to',
        {
          from,
          to,
        },
      );
    }

    return { createdAt };
  }

  async handle(job: Job) {
    const startedAt = Date.now();
    const storage = this.getStorageTarget();
    const bucket = storage.bucket;

    const dateRaw = typeof job.data?.date === 'string' ? job.data.date : null;
    const fromRaw = typeof job.data?.from === 'string' ? job.data.from : null;
    const toRaw = typeof job.data?.to === 'string' ? job.data.to : null;
    const where = this.buildDateFilter(dateRaw, fromRaw, toRaw);

    const objectKey = `reports/users/users-${Date.now()}-${String(job.id)}.csv`;
    const uploadStream = new PassThrough();
    const upload = new Upload({
      client: storage.client,
      params: {
        Bucket: bucket,
        Key: objectKey,
        Body: uploadStream,
        ContentType: 'text/csv; charset=utf-8',
      },
      queueSize: 4,
      partSize: 5 * 1024 * 1024,
      leavePartsOnError: false,
    });
    const uploadPromise = upload.done();

    let sizeBytes = 0;
    const writeCsvChunk = async (chunk: string) => {
      const buffer = Buffer.from(chunk, 'utf8');
      sizeBytes += buffer.byteLength;

      if (!uploadStream.write(buffer)) {
        await once(uploadStream, 'drain');
      }
    };

    const pageSize = 1000;
    let cursorId: string | undefined;
    let usersExported = 0;

    try {
      await writeCsvChunk('id,email,status,role,createdAt,updatedAt\n');

      while (true) {
        const users = await this.prisma.user.findMany({
          where,
          select: {
            id: true,
            email: true,
            status: true,
            role: true,
            createdAt: true,
            updatedAt: true,
          },
          orderBy: {
            id: 'asc',
          },
          take: pageSize,
          ...(cursorId
            ? {
                cursor: { id: cursorId },
                skip: 1,
              }
            : {}),
        });

        if (users.length === 0) {
          break;
        }

        for (const user of users) {
          const row = [
            this.escapeCsv(user.id),
            this.escapeCsv(user.email),
            this.escapeCsv(user.status),
            this.escapeCsv(user.role),
            this.escapeCsv(user.createdAt.toISOString()),
            this.escapeCsv(user.updatedAt.toISOString()),
          ].join(',');

          await writeCsvChunk(`${row}\n`);
        }

        usersExported += users.length;
        cursorId = users[users.length - 1]!.id;
      }

      uploadStream.end();
      await uploadPromise;
    } catch (error) {
      uploadStream.destroy(
        error instanceof Error ? error : new Error(String(error)),
      );
      await uploadPromise.catch(() => undefined);
      throw error;
    } finally {
      storage.client.destroy();
    }

    await this.prisma.fileObject.create({
      data: {
        bucket,
        objectKey,
        mimeType: 'text/csv',
        size: sizeBytes,
      },
    });

    const elapsedMs = Math.max(1, Date.now() - startedAt);
    const rowsPerSecond = Number(
      (usersExported / (elapsedMs / 1000)).toFixed(2),
    );
    const bytesPerSecond = Number((sizeBytes / (elapsedMs / 1000)).toFixed(2));

    this.logger.log(
      JSON.stringify({
        msg: 'users_csv_exported',
        traceId: getTraceId(),
        jobId: String(job.id),
        bucket,
        storageProvider: storage.provider,
        objectKey,
        usersExported,
        sizeBytes,
        elapsedMs,
        rowsPerSecond,
        bytesPerSecond,
      }),
    );

    return {
      ok: true,
      jobId: String(job.id),
      storageProvider: storage.provider,
      bucket,
      objectKey,
      mimeType: 'text/csv',
      sizeBytes,
      usersExported,
      elapsedMs,
      rowsPerSecond,
      bytesPerSecond,
      filter: {
        date: dateRaw,
        from: fromRaw,
        to: toRaw,
      },
    };
  }
}
