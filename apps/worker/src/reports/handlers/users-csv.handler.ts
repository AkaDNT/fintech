import { Injectable, Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getTraceId } from '@repo/shared';
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

  private getS3Client(): S3Client {
    const endpoint = process.env.MINIO_ENDPOINT;
    const accessKeyId = process.env.MINIO_ACCESS_KEY;
    const secretAccessKey = process.env.MINIO_SECRET_KEY;

    if (!endpoint || !accessKeyId || !secretAccessKey) {
      throw new Error('MinIO/S3 configuration is missing');
    }

    return new S3Client({
      region: process.env.AWS_REGION || 'us-east-1',
      endpoint,
      forcePathStyle: true,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  }

  private buildDateFilter(
    dateRaw: string | null,
    fromRaw: string | null,
    toRaw: string | null,
  ) {
    const parseYmd = (value: string, fieldName: string) => {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        throw new Error(`Invalid ${fieldName} filter: ${value}`);
      }

      const parsed = new Date(`${value}T00:00:00.000Z`);
      if (Number.isNaN(parsed.getTime())) {
        throw new Error(`Invalid ${fieldName} filter: ${value}`);
      }

      return parsed;
    };

    const from = typeof fromRaw === 'string' ? fromRaw.trim() : '';
    const to = typeof toRaw === 'string' ? toRaw.trim() : '';
    const legacyDateRaw = typeof dateRaw === 'string' ? dateRaw.trim() : '';

    if ((from || to) && legacyDateRaw) {
      throw new Error('Use either date or from/to filters, not both');
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
      throw new Error('Invalid range: from must be <= to');
    }

    return { createdAt };
  }

  async handle(job: Job) {
    const bucket = process.env.MINIO_BUCKET;
    if (!bucket) {
      throw new Error('MINIO_BUCKET is missing');
    }

    const dateRaw = typeof job.data?.date === 'string' ? job.data.date : null;
    const fromRaw = typeof job.data?.from === 'string' ? job.data.from : null;
    const toRaw = typeof job.data?.to === 'string' ? job.data.to : null;
    const where = this.buildDateFilter(dateRaw, fromRaw, toRaw);

    const rows: string[] = ['id,email,status,role,createdAt,updatedAt'];

    const pageSize = 1000;
    let cursorId: string | undefined;
    let usersExported = 0;

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
        rows.push(
          [
            this.escapeCsv(user.id),
            this.escapeCsv(user.email),
            this.escapeCsv(user.status),
            this.escapeCsv(user.role),
            this.escapeCsv(user.createdAt.toISOString()),
            this.escapeCsv(user.updatedAt.toISOString()),
          ].join(','),
        );
      }

      usersExported += users.length;
      cursorId = users[users.length - 1]!.id;
    }

    const csvContent = `${rows.join('\n')}\n`;
    const csvBuffer = Buffer.from(csvContent, 'utf8');
    const objectKey = `reports/users/users-${Date.now()}-${String(job.id)}.csv`;

    const s3 = this.getS3Client();
    await s3.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: objectKey,
        Body: csvBuffer,
        ContentType: 'text/csv; charset=utf-8',
      }),
    );

    await this.prisma.fileObject.create({
      data: {
        bucket,
        objectKey,
        mimeType: 'text/csv',
        size: csvBuffer.byteLength,
      },
    });

    this.logger.log(
      JSON.stringify({
        msg: 'users_csv_exported',
        traceId: getTraceId(),
        jobId: String(job.id),
        bucket,
        objectKey,
        usersExported,
        sizeBytes: csvBuffer.byteLength,
      }),
    );

    return {
      ok: true,
      jobId: String(job.id),
      bucket,
      objectKey,
      mimeType: 'text/csv',
      sizeBytes: csvBuffer.byteLength,
      usersExported,
      filter: {
        date: dateRaw,
        from: fromRaw,
        to: toRaw,
      },
    };
  }
}
