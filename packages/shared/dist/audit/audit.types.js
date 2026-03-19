"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AUDIT_ACTIONS = exports.AUDIT_ACTOR_TYPES = void 0;
exports.AUDIT_ACTOR_TYPES = {
    USER: "USER",
    ADMIN: "ADMIN",
    SYSTEM: "SYSTEM",
};
exports.AUDIT_ACTIONS = {
    PAYMENT_HOLD: "payment.hold",
    PAYMENT_CAPTURE: "payment.capture",
    PAYMENT_CANCEL: "payment.cancel",
    PAYMENT_REFUND: "payment.refund",
    PAYMENT_EXPIRE_HOLD: "payment.expire_hold",
};
