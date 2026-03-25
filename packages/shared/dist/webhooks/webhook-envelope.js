"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildWebhookEnvelope = buildWebhookEnvelope;
function buildWebhookEnvelope(params) {
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
