import { Injectable, Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { PrismaService } from 'src/prisma/prisma.service';
import { JobHandler } from '../ports/job-handler.port';
import { PaymentCallbackDomainService } from '../payment-callback-domain.service';
import { PaymentWebhookNormalizer } from '../payment-webhook.normalizer';
import { PaymentCorrelationResolverService } from '../payment-correlation-resolver.service';
import { DomainError } from '@repo/shared';

@Injectable()
export class ProcessInboxMessageHandler implements JobHandler {
  readonly name = 'PROCESS_INBOX_MESSAGE';
  private readonly logger = new Logger(ProcessInboxMessageHandler.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly normalizer: PaymentWebhookNormalizer,
    private readonly resolver: PaymentCorrelationResolverService,
    private readonly paymentCallbackDomain: PaymentCallbackDomainService,
  ) {}

  async handle(job: Job) {
    const inboxMessageId = String(job.data?.inboxMessageId ?? '');

    const row = await this.prisma.inboxMessage.findUnique({
      where: { id: inboxMessageId },
    });

    if (!row) {
      return { ok: false, reason: 'InboxMessage not found' };
    }

    const locked = await this.prisma.inboxMessage.updateMany({
      where: {
        id: row.id,
        status: 'RECEIVED',
      },
      data: {
        status: 'PROCESSING',
      },
    });

    if (locked.count === 0) {
      return { ok: true, skipped: true };
    }

    try {
      const normalized = this.normalizer.normalize({
        source: row.source,
        eventType: row.eventType,
        payload: row.payload as Record<string, unknown>,
      });

      const paymentId = await this.resolver.resolve(normalized.correlation);

      await this.paymentCallbackDomain.consume({
        paymentId,
        source: normalized.source,
        eventType: normalized.eventType,
        payload: normalized.payload,
        traceId: row.traceId ?? 'unknown',
      });

      await this.prisma.inboxMessage.update({
        where: { id: row.id },
        data: {
          status: 'PROCESSED',
          processedAt: new Date(),
          lastError: null,
        },
      });

      return { ok: true };
    } catch (error: any) {
      const message =
        error instanceof DomainError
          ? `${error.code}: ${error.message}`
          : (error?.message ?? 'Unknown error');

      await this.prisma.inboxMessage.update({
        where: { id: row.id },
        data: {
          status: 'FAILED',
          lastError: message.slice(0, 1000),
        },
      });

      this.logger.warn(
        JSON.stringify({
          msg: 'inbox_failed',
          inboxMessageId: row.id,
          source: row.source,
          eventType: row.eventType,
          traceId: row.traceId ?? 'unknown',
          jobId: String(job.id),
          error: message,
        }),
      );

      throw error;
    }
  }
}
