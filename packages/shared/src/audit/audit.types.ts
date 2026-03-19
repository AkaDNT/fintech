export const AUDIT_ACTOR_TYPES = {
  USER: "USER",
  ADMIN: "ADMIN",
  SYSTEM: "SYSTEM",
} as const;

export type AuditActorType =
  (typeof AUDIT_ACTOR_TYPES)[keyof typeof AUDIT_ACTOR_TYPES];

export const AUDIT_ACTIONS = {
  PAYMENT_HOLD: "payment.hold",
  PAYMENT_CAPTURE: "payment.capture",
  PAYMENT_CANCEL: "payment.cancel",
  PAYMENT_REFUND: "payment.refund",
  PAYMENT_EXPIRE_HOLD: "payment.expire_hold",
} as const;

export type AuditAction = (typeof AUDIT_ACTIONS)[keyof typeof AUDIT_ACTIONS];
