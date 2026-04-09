export type VerifiedInboundWebhook = {
  externalId: string;
  eventType: string;
  payload: unknown;
  occurredAt?: string | null;
};

export interface InboundWebhookVerifier {
  readonly source: string;

  verify(params: {
    headers: Record<string, string | string[] | undefined>;
    rawBody: string;
  }): Promise<VerifiedInboundWebhook>;
}
