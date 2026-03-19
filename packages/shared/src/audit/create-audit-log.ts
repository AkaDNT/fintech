import type { AuditActorType, AuditAction } from "./audit.types";

export async function createAuditLog(
  tx: any,
  params: {
    actorType: AuditActorType;
    actorId?: string | null;
    action: AuditAction;
    entityType: string;
    entityId: string;
    before?: Record<string, unknown> | null;
    after?: Record<string, unknown> | null;
    metadata?: Record<string, unknown> | null;
    traceId?: string | null;
  },
) {
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
