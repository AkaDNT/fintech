export type WebhookEnvelope<TData extends Record<string, unknown> = Record<string, unknown>> = {
    id: string;
    eventType: string;
    aggregateType: string;
    aggregateId: string;
    occurredAt: string;
    traceId: string | null;
    data: TData;
};
export declare function buildWebhookEnvelope<TData extends Record<string, unknown>>(params: {
    id: string;
    eventType: string;
    aggregateType: string;
    aggregateId: string;
    occurredAt: string;
    traceId?: string | null;
    data: TData;
}): WebhookEnvelope<TData>;
