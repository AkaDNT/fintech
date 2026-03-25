export declare const WEBHOOK_VERSION = "v1";
export declare const WEBHOOK_SIGNATURE_ALGORITHM = "sha256";
export declare const WEBHOOK_HEADERS: {
    readonly ID: "x-webhook-id";
    readonly EVENT: "x-webhook-event";
    readonly TIMESTAMP: "x-webhook-timestamp";
    readonly SIGNATURE: "x-webhook-signature";
    readonly TRACE_ID: "x-trace-id";
    readonly VERSION: "x-webhook-version";
};
