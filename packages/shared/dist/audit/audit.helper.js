"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAuditLog = createAuditLog;
async function createAuditLog(tx, params) {
    return tx.auditLog.create({
        data: {
            actorType: params.actorType,
            actorId: params.actorId ?? null,
            action: params.action,
            entityType: params.entityType,
            entityId: params.entityId,
            before: params.before ?? null,
            after: params.after ?? null,
            metadata: params.metadata ?? null,
            traceId: params.traceId ?? null,
        },
        select: {
            id: true,
            createdAt: true,
        },
    });
}
