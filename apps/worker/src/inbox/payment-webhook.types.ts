export type PaymentCorrelationCandidates = {
  internalPaymentId?: string | null;
  externalRef?: string | null;
  merchantRef?: string | null;
};

export type NormalizedInboundPaymentEvent = {
  source: string;
  eventType: string;
  payload: Record<string, unknown>;
  correlation: PaymentCorrelationCandidates;
};
