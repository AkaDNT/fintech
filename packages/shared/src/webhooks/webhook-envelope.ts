export type WebhookEnvelope<
  TData extends Record<string, unknown> = Record<string, unknown>,
> = {
  id: string;
  eventType: string;
  aggregateType: string;
  aggregateId: string;
  occurredAt: string;
  traceId: string | null;
  data: TData;
};

export function buildWebhookEnvelope<
  TData extends Record<string, unknown>,
>(params: {
  id: string;
  eventType: string;
  aggregateType: string;
  aggregateId: string;
  occurredAt: string;
  traceId?: string | null;
  data: TData;
}): WebhookEnvelope<TData> {
  return {
    id: params.id,
    eventType: params.eventType,
    aggregateType: params.aggregateType,
    aggregateId: params.aggregateId,
    occurredAt: params.occurredAt,
    traceId: params.traceId ?? null,
    data: params.data,
  };
}
