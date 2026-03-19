export declare const AUDIT_ACTOR_TYPES: {
    readonly USER: "USER";
    readonly ADMIN: "ADMIN";
    readonly SYSTEM: "SYSTEM";
};
export type AuditActorType = (typeof AUDIT_ACTOR_TYPES)[keyof typeof AUDIT_ACTOR_TYPES];
export declare const AUDIT_ACTIONS: {
    readonly PAYMENT_HOLD: "payment.hold";
    readonly PAYMENT_CAPTURE: "payment.capture";
    readonly PAYMENT_CANCEL: "payment.cancel";
    readonly PAYMENT_REFUND: "payment.refund";
    readonly PAYMENT_EXPIRE_HOLD: "payment.expire_hold";
};
export type AuditAction = (typeof AUDIT_ACTIONS)[keyof typeof AUDIT_ACTIONS];
