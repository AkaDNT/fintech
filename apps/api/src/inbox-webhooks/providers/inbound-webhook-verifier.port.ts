import { Prisma } from '@prisma/client';

export type VerifiedInboundWebhook = {
  externalId: string;
  eventType: string;
  payload: Prisma.InputJsonValue;
  occurredAt?: string | null;
};

export interface InboundWebhookVerifier {
  readonly source: string;

  verify(params: {
    headers: Record<string, string | string[] | undefined>;
    rawBody: string;
  }): Promise<VerifiedInboundWebhook>;
}
