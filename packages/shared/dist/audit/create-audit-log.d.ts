import type { AuditActorType, AuditAction } from "./audit.types";
export declare function createAuditLog(tx: any, params: {
    actorType: AuditActorType;
    actorId?: string | null;
    action: AuditAction;
    entityType: string;
    entityId: string;
    before?: Record<string, unknown> | null;
    after?: Record<string, unknown> | null;
    metadata?: Record<string, unknown> | null;
    traceId?: string | null;
}): Promise<any>;
