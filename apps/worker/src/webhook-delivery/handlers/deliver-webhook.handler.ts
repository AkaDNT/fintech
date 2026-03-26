import { Injectable, Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { PrismaService } from 'src/prisma/prisma.service';
import { JobHandler } from '../ports/job-handler.port';
import {
  WEBHOOK_HEADERS,
  WEBHOOK_VERSION,
  buildWebhookEnvelope,
  canonicalizeWebhookBody,
  signWebhookPayload,
} from '@repo/shared';
import { getTraceId } from '@repo/shared';
import { computeNextAttemptAt, safeTruncate } from './backoff';

@Injectable()
export class DeliverWebhookHandler implements JobHandler {
  readonly name = 'DELIVER_WEBHOOK';
  private readonly logger = new Logger(DeliverWebhookHandler.name);

  constructor(private readonly prisma: PrismaService) {}

  async handle(job: Job) {
    const now = new Date();

    const deliveries = await this.prisma.webhookDelivery.findMany({
      where: {
        status: { in: ['PENDING', 'FAILED'] },
        nextAttemptAt: { lte: now },
      },
      orderBy: { createdAt: 'asc' },
      take: 100,
      include: {
        endpoint: {
          select: {
            id: true,
            targetUrl: true,
            secret: true,
            status: true,
          },
        },
      },
    });

    let succeeded = 0;
    let failed = 0;
    let dead = 0;
    let skipped = 0;

    for (const delivery of deliveries) {
      try {
        const locked = await this.prisma.webhookDelivery.updateMany({
          where: {
            id: delivery.id,
            status: { in: ['PENDING', 'FAILED'] },
          },
          data: {
            status: 'PROCESSING',
          },
        });

        if (locked.count === 0) {
          skipped += 1;
          continue;
        }

        if (delivery.endpoint.status !== 'ACTIVE') {
          await this.prisma.webhookDelivery.update({
            where: { id: delivery.id },
            data: {
              status: 'DEAD',
              lastError: 'Endpoint is disabled',
              updatedAt: new Date(),
            },
          });
          dead += 1;
          continue;
        }

        const timestamp = new Date().toISOString();

        const body = buildWebhookEnvelope({
          id: delivery.id,
          eventType: delivery.eventType,
          aggregateType: 'payment',
          aggregateId: delivery.outboxEventId ?? delivery.id,
          occurredAt: delivery.createdAt.toISOString(),
          traceId: delivery.traceId ?? null,
          data: delivery.payload as Record<string, unknown>,
        });

        const canonicalBody = canonicalizeWebhookBody(body);

        const signature = signWebhookPayload({
          secret: delivery.endpoint.secret,
          timestamp,
          canonicalBody,
        });

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000);

        let responseStatus: number | null = null;
        let responseText: string | null = null;

        try {
          const response = await fetch(delivery.endpoint.targetUrl, {
            method: 'POST',
            headers: {
              'content-type': 'application/json',
              [WEBHOOK_HEADERS.ID]: delivery.id,
              [WEBHOOK_HEADERS.EVENT]: delivery.eventType,
              [WEBHOOK_HEADERS.TIMESTAMP]: timestamp,
              [WEBHOOK_HEADERS.SIGNATURE]: signature,
              [WEBHOOK_HEADERS.TRACE_ID]: delivery.traceId ?? '',
              [WEBHOOK_HEADERS.VERSION]: WEBHOOK_VERSION,
            },
            body: canonicalBody,
            signal: controller.signal,
          });

          responseStatus = response.status;
          responseText = safeTruncate(await response.text());

          clearTimeout(timeout);

          const nextAttemptCount = delivery.attemptCount + 1;

          if (response.ok) {
            await this.prisma.webhookDelivery.update({
              where: { id: delivery.id },
              data: {
                status: 'SUCCEEDED',
                attemptCount: nextAttemptCount,
                signature,
                lastHttpStatus: responseStatus,
                responseBody: responseText,
                lastError: null,
              },
            });

            this.logger.log(
              JSON.stringify({
                msg: 'webhook_delivery_succeeded',
                traceId: getTraceId(),
                jobId: String(job.id),
                deliveryId: delivery.id,
                endpointId: delivery.endpointId,
                eventType: delivery.eventType,
                attemptCount: nextAttemptCount,
                httpStatus: responseStatus,
              }),
            );

            succeeded += 1;
            continue;
          }

          const nextAttemptAt = computeNextAttemptAt(nextAttemptCount);

          await this.prisma.webhookDelivery.update({
            where: { id: delivery.id },
            data: {
              status: nextAttemptAt ? 'FAILED' : 'DEAD',
              attemptCount: nextAttemptCount,
              signature,
              lastHttpStatus: responseStatus,
              responseBody: responseText,
              lastError: `HTTP ${responseStatus}`,
              nextAttemptAt: nextAttemptAt ?? delivery.nextAttemptAt,
            },
          });

          if (nextAttemptAt) {
            failed += 1;
          } else {
            dead += 1;
          }
        } catch (error: any) {
          clearTimeout(timeout);

          const nextAttemptCount = delivery.attemptCount + 1;
          const nextAttemptAt = computeNextAttemptAt(nextAttemptCount);
          const message =
            error?.name === 'AbortError'
              ? 'Request timeout'
              : (error?.message ?? 'Unknown network error');

          await this.prisma.webhookDelivery.update({
            where: { id: delivery.id },
            data: {
              status: nextAttemptAt ? 'FAILED' : 'DEAD',
              attemptCount: nextAttemptCount,
              lastHttpStatus: responseStatus,
              responseBody: responseText,
              lastError: safeTruncate(message, 1000),
              nextAttemptAt: nextAttemptAt ?? delivery.nextAttemptAt,
            },
          });

          this.logger.warn(
            JSON.stringify({
              msg: 'webhook_delivery_failed',
              traceId: getTraceId(),
              jobId: String(job.id),
              deliveryId: delivery.id,
              endpointId: delivery.endpointId,
              eventType: delivery.eventType,
              attemptCount: nextAttemptCount,
              error: message,
            }),
          );

          if (nextAttemptAt) {
            failed += 1;
          } else {
            dead += 1;
          }
        }
      } catch (error: any) {
        this.logger.error(
          JSON.stringify({
            msg: 'webhook_delivery_handler_error',
            traceId: getTraceId(),
            jobId: String(job.id),
            deliveryId: delivery.id,
            error: error?.message ?? 'Unknown error',
          }),
        );
      }
    }

    return {
      ok: true,
      succeeded,
      failed,
      dead,
      skipped,
    };
  }
}
