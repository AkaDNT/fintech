"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WEBHOOK_HEADERS = exports.WEBHOOK_SIGNATURE_ALGORITHM = exports.WEBHOOK_VERSION = void 0;
exports.WEBHOOK_VERSION = "v1";
exports.WEBHOOK_SIGNATURE_ALGORITHM = "sha256";
exports.WEBHOOK_HEADERS = {
    ID: "x-webhook-id",
    EVENT: "x-webhook-event",
    TIMESTAMP: "x-webhook-timestamp",
    SIGNATURE: "x-webhook-signature",
    TRACE_ID: "x-trace-id",
    VERSION: "x-webhook-version",
};
