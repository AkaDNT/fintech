import { Injectable, Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { PrismaService } from 'src/prisma/prisma.service';
import { JobHandler } from '../ports/job-handler.port';

@Injectable()
export class PublishOutboxEventsHandler implements JobHandler {
  readonly name = 'PUBLISH_OUTBOX_EVENTS';
  private readonly logger = new Logger(PublishOutboxEventsHandler.name);

  constructor(private readonly prisma: PrismaService) {}

  async handle(job: Job) {
    const now = new Date();

    const outboxEvents = await this.prisma.outboxEvent.findMany({
      where: {
        status: 'PENDING',
        availableAt: { lte: now },
      },
      orderBy: { createdAt: 'asc' },
      take: 100,
    });

    let published = 0;
    let skipped = 0;
    let failed = 0;

    for (const event of outboxEvents) {
      try {
        const updated = await this.prisma.$transaction(async (tx) => {
          const locked = await tx.outboxEvent.updateMany({
            where: {
              id: event.id,
              status: 'PENDING',
            },
            data: {
              status: 'PROCESSING',
            },
          });

          if (locked.count === 0) {
            return 'skipped';
          }

          const endpoints = await tx.webhookEndpoint.findMany({
            where: {
              status: 'ACTIVE',
              eventTypes: {
                has: event.eventType,
              },
            },
            select: {
              id: true,
              secret: true,
            },
          });

          for (const endpoint of endpoints) {
            await tx.webhookDelivery.create({
              data: {
                endpointId: endpoint.id,
                outboxEventId: event.id,
                eventType: event.eventType,
                payload: event.payload!,
                status: 'PENDING',
                attemptCount: 0,
                nextAttemptAt: now,
                traceId: (event.payload as any)?.traceId ?? null,
              },
            });
          }

          await tx.outboxEvent.update({
            where: { id: event.id },
            data: {
              status: 'PUBLISHED',
              publishedAt: now,
              lastError: null,
            },
          });

          return 'published';
        });

        if (updated === 'published') {
          published += 1;
        } else {
          skipped += 1;
        }
      } catch (error: any) {
        failed += 1;

        await this.prisma.outboxEvent.update({
          where: { id: event.id },
          data: {
            status: 'FAILED',
            attempts: { increment: 1 },
            availableAt: new Date(Date.now() + 60_000),
            lastError: error?.message?.slice(0, 1000) ?? 'Unknown error',
          },
        });

        this.logger.error(
          JSON.stringify({
            msg: 'outbox_publish_failed',
            traceId: (event.payload as any)?.traceId ?? null,
            jobId: String(job.id),
            outboxEventId: event.id,
            eventType: event.eventType,
            error: error?.message ?? 'Unknown error',
          }),
        );
      }
    }

    this.logger.log(
      JSON.stringify({
        msg: 'outbox_publish_done',
        traceId: job.data?.traceId ?? 'unknown',
        jobId: String(job.id),
        published,
        skipped,
        failed,
      }),
    );

    return {
      ok: true,
      published,
      skipped,
      failed,
    };
  }
}
