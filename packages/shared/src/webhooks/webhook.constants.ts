export const WEBHOOK_VERSION = "v1";
export const WEBHOOK_SIGNATURE_ALGORITHM = "sha256";

export const WEBHOOK_HEADERS = {
  ID: "x-webhook-id",
  EVENT: "x-webhook-event",
  TIMESTAMP: "x-webhook-timestamp",
  SIGNATURE: "x-webhook-signature",
  TRACE_ID: "x-trace-id",
  VERSION: "x-webhook-version",
} as const;
