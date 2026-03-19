type AuditActorType = 'USER' | 'ADMIN' | 'SYSTEM';
export declare function createAuditLog(tx: any, params: {
    actorType: AuditActorType;
    actorId?: string | null;
    action: string;
    entityType: string;
    entityId: string;
    before?: Record<string, unknown> | null;
    after?: Record<string, unknown> | null;
    metadata?: Record<string, unknown> | null;
    traceId?: string | null;
}): Promise<any>;
export {};
