import { Injectable, HttpStatus, Inject } from '@nestjs/common';
import { REPORTS_QUEUE } from './reports.queue';
import { AppException } from 'src/common/errors/app.exception';
import { ERROR_CODES } from 'src/common/errors/error-codes';
import { Queue } from 'bullmq';
import { Currency } from '@repo/db';
import { UsersCsvQueryDto } from './dto/users-csv-query.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';

@Injectable()
export class ReportsService {
  constructor(
    @Inject(REPORTS_QUEUE) private readonly reportsQueue: Queue,
    private readonly prisma: PrismaService,
  ) {}

  private getStorageTarget(): {
    bucket: string;
    client: S3Client;
  } {
    const bucket = process.env.S3_BUCKET?.trim();
    const region = process.env.AWS_REGION?.trim() || 'ap-southeast-1';
    const endpoint =
      process.env.S3_ENDPOINT?.trim() || process.env.MINIO_ENDPOINT?.trim();
    const accessKeyId =
      process.env.S3_ACCESS_KEY?.trim() ||
      process.env.MINIO_ACCESS_KEY?.trim() ||
      process.env.AWS_ACCESS_KEY_ID?.trim();
    const secretAccessKey =
      process.env.S3_SECRET_KEY?.trim() ||
      process.env.MINIO_SECRET_KEY?.trim() ||
      process.env.AWS_SECRET_ACCESS_KEY?.trim();

    if (!bucket) {
      throw new AppException(
        {
          code: ERROR_CODES.INTERNAL_ERROR,
          message: 'Missing S3_BUCKET for report download',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const s3Config: ConstructorParameters<typeof S3Client>[0] = { region };

    if (endpoint) {
      s3Config.endpoint = endpoint;
      s3Config.forcePathStyle =
        (process.env.S3_FORCE_PATH_STYLE ?? 'true') === 'true';
    }

    if (accessKeyId && secretAccessKey) {
      s3Config.credentials = {
        accessKeyId,
        secretAccessKey,
      };
    }

    return {
      bucket,
      client: new S3Client(s3Config),
    };
  }
  async enqueueUsersCsv(traceId: string, filter?: UsersCsvQueryDto) {
    const job = await this.reportsQueue.add(
      'USERS_CSV',
      {
        traceId,
        date: filter?.date || null,
        from: filter?.from || null,
        to: filter?.to || null,
      },
      {
        attempts: 5,
        backoff: { type: 'exponential', delay: 2000 },
        removeOnComplete: { count: 1000 },
        removeOnFail: { count: 5000 },
      },
    );

    return { jobId: job.id };
  }

  enqueueReconcile(traceId: string, currency?: Currency) {
    return this.reportsQueue.add(
      'RECONCILE_WALLETS',
      { traceId, currency: currency ?? null },
      {
        attempts: 5,
        backoff: { type: 'exponential', delay: 2000 },
        removeOnComplete: { count: 1000 },
        removeOnFail: { count: 5000 },
      },
    );
  }

  async getJobStatus(id: string) {
    const job = await this.reportsQueue.getJob(id);
    if (!job) {
      throw new AppException(
        { code: ERROR_CODES.JOB_NOT_FOUND, message: 'Job not found' },
        HttpStatus.NOT_FOUND,
      );
    }

    const state = await job.getState();
    return {
      id: String(job.id),
      name: job.name,
      state,
      progress: job.progress ?? 0,
      failedReason: job.failedReason ?? null,
      returnValue: (job as any).returnvalue ?? null,
      attemptsMade: job.attemptsMade,
    };
  }

  async listRecentUsersCsv(limit = 10) {
    const safeLimit = Math.min(Math.max(limit, 1), 50);

    const rows = await this.prisma.fileObject.findMany({
      where: {
        mimeType: 'text/csv',
        objectKey: {
          startsWith: 'reports/users/',
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: safeLimit,
      select: {
        id: true,
        bucket: true,
        objectKey: true,
        mimeType: true,
        size: true,
        createdAt: true,
      },
    });

    return {
      count: rows.length,
      items: rows,
    };
  }

  async downloadUsersCsv(id: string) {
    const file = await this.prisma.fileObject.findUnique({
      where: { id },
      select: {
        id: true,
        bucket: true,
        objectKey: true,
        mimeType: true,
        size: true,
        createdAt: true,
      },
    });

    if (
      !file ||
      file.mimeType !== 'text/csv' ||
      !file.objectKey.startsWith('reports/users/')
    ) {
      throw new AppException(
        {
          code: ERROR_CODES.RESOURCE_NOT_FOUND,
          message: 'Users CSV file not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    const storage = this.getStorageTarget();

    try {
      const response = await storage.client.send(
        new GetObjectCommand({
          Bucket: file.bucket || storage.bucket,
          Key: file.objectKey,
        }),
      );

      const payload = await response.Body?.transformToByteArray();
      if (!payload) {
        throw new AppException(
          {
            code: ERROR_CODES.INTERNAL_ERROR,
            message: 'Empty CSV payload from storage',
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      return {
        file,
        buffer: Buffer.from(payload),
      };
    } finally {
      storage.client.destroy();
    }
  }
}
