import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { InboxJobsService } from 'src/inbox-jobs/inbox-jobs.service';
import { AppException } from 'src/common/errors/app.exception';
import { ERROR_CODES } from 'src/common/errors/error-codes';
import { InboundWebhookVerifier } from './providers/inbound-webhook-verifier.port';

@Injectable()
export class InboxWebhooksService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly inboxJobs: InboxJobsService,
    @Inject('INBOUND_WEBHOOK_VERIFIERS')
    private readonly verifiers: InboundWebhookVerifier[],
  ) {}

  async receive(params: {
    source: string;
    headers: Record<string, string | string[] | undefined>;
    rawBody: string;
    traceId?: string | null;
  }) {
    const verifier = this.verifiers.find((x) => x.source === params.source);

    if (!verifier) {
      throw new AppException(
        {
          code: ERROR_CODES.WEBHOOK_SOURCE_UNSUPPORTED,
          message: `Unsupported webhook source: ${params.source}`,
        },
        HttpStatus.NOT_FOUND,
      );
    }

    const verified = await verifier.verify({
      headers: params.headers,
      rawBody: params.rawBody,
    });

    try {
      const row = await this.prisma.inboxMessage.create({
        data: {
          source: params.source,
          externalId: verified.externalId,
          eventType: verified.eventType,
          payload: verified.payload,
          status: 'RECEIVED',
          traceId: params.traceId ?? null,
        },
        select: {
          id: true,
          source: true,
          externalId: true,
          eventType: true,
          status: true,
          createdAt: true,
        },
      });

      await this.inboxJobs.enqueueProcessInbox({
        inboxMessageId: row.id,
        traceId: params.traceId ?? 'unknown',
      });

      return {
        accepted: true,
        duplicate: false,
        inboxMessageId: row.id,
        status: row.status,
      };
    } catch (error: any) {
      const isUnique =
        error?.code === 'P2002' ||
        error?.meta?.target?.includes?.('source_externalId');

      if (isUnique) {
        return {
          accepted: true,
          duplicate: true,
          reason: 'Already received',
        };
      }

      throw error;
    }
  }
}
