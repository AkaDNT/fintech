import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Worker } from 'bullmq';
import IORedis from 'ioredis';
import { runWithTraceId, getTraceId } from '@repo/shared';
import { PrismaClient } from '@repo/db';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

@Injectable()
export class ReportsWorker implements OnModuleInit, OnModuleDestroy {
  private worker!: Worker;
  private prisma = new PrismaClient();
  private redis = new IORedis(process.env.REDIS_URL!, {
    maxRetriesPerRequest: null,
  });
  private s3 = new S3Client({
    region: 'us-east-1',
    endpoint: process.env.MINIO_ENDPOINT,
    credentials: {
      accessKeyId: process.env.MINIO_ACCESS_KEY!,
      secretAccessKey: process.env.MINIO_SECRET_KEY!,
    },
    forcePathStyle: true,
  });

  async onModuleInit() {
    this.worker = new Worker(
      'reports',
      async (job) => {
        const traceId = job.data?.traceId ?? 'unknown';

        return runWithTraceId(traceId, async () => {
          console.log(
            JSON.stringify({
              level: 'info',
              traceId: getTraceId(),
              msg: 'job_start',
              jobId: job.id,
            }),
          );

          if (job.name !== 'USERS_CSV') return;

          const users = await this.prisma.user.findMany({
            select: {
              id: true,
              email: true,
              role: true,
              status: true,
              createdAt: true,
            },
            orderBy: { createdAt: 'desc' },
            take: 5000,
          });

          const csv = toCsv(
            users.map((u) => ({
              id: u.id,
              email: u.email,
              role: u.role,
              status: u.status,
              createdAt: u.createdAt.toISOString(),
            })),
          );

          const buf = Buffer.from(csv, 'utf-8');
          const objectKey = `reports/users/users-${Date.now()}.csv`;

          await this.s3.send(
            new PutObjectCommand({
              Bucket: process.env.MINIO_BUCKET!,
              Key: objectKey,
              Body: buf,
              ContentType: 'text/csv',
            }),
          );

          const file = await this.prisma.fileObject.create({
            data: {
              bucket: process.env.MINIO_BUCKET!,
              objectKey,
              mimeType: 'text/csv',
              size: buf.length,
            },
          });

          console.log(
            JSON.stringify({
              level: 'info',
              traceId: getTraceId(),
              msg: 'job_done',
              jobId: job.id,
              fileId: file.id,
            }),
          );

          return {
            fileId: file.id,
            bucket: file.bucket,
            objectKey: file.objectKey,
          };
        });
      },
      { connection: this.redis },
    );

    console.log('ReportsWorker started');
  }

  async onModuleDestroy() {
    await this.worker?.close();
    await this.redis?.quit();
    await this.prisma?.$disconnect();
  }
}

function toCsv(rows: Array<Record<string, any>>) {
  const headers = Object.keys(rows[0] || {});
  const escape = (v: any) => {
    const s = String(v ?? '');
    const needs = s.includes(',') || s.includes('\n') || s.includes('"');
    const out = s.replace(/"/g, '""');
    return needs ? `"${out}"` : out;
  };
  const lines = [headers.join(',')];
  for (const r of rows) lines.push(headers.map((h) => escape(r[h])).join(','));
  return lines.join('\n');
}
