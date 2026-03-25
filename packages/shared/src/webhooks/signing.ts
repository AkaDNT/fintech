import * as crypto from "node:crypto";
import { WEBHOOK_VERSION } from "./webhook.constants";

type JsonLike =
  | null
  | string
  | number
  | boolean
  | JsonLike[]
  | { [key: string]: JsonLike };

function normalizeForSigning(value: unknown): JsonLike {
  if (
    value === null ||
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return value;
  }

  if (typeof value === "bigint") {
    return value.toString();
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (Array.isArray(value)) {
    return value.map(normalizeForSigning);
  }

  if (typeof value === "object") {
    const obj = value as Record<string, unknown>;
    const sortedKeys = Object.keys(obj).sort();
    const out: Record<string, JsonLike> = {};

    for (const key of sortedKeys) {
      const v = obj[key];

      if (typeof v === "undefined") continue;
      out[key] = normalizeForSigning(v);
    }

    return out;
  }

  return String(value);
}

export function canonicalizeWebhookBody(body: Record<string, unknown>): string {
  return JSON.stringify(normalizeForSigning(body));
}

export function createWebhookSigningBase(params: {
  timestamp: string;
  canonicalBody: string;
}): string {
  return `${params.timestamp}.${params.canonicalBody}`;
}

export function signWebhookPayload(params: {
  secret: string;
  timestamp: string;
  canonicalBody: string;
}): string {
  const base = createWebhookSigningBase({
    timestamp: params.timestamp,
    canonicalBody: params.canonicalBody,
  });

  const digest = crypto
    .createHmac("sha256", params.secret)
    .update(base, "utf8")
    .digest("hex");

  return `${WEBHOOK_VERSION}=${digest}`;
}

export function verifyWebhookSignature(params: {
  secret: string;
  timestamp: string;
  canonicalBody: string;
  signature: string;
}): boolean {
  const expected = signWebhookPayload({
    secret: params.secret,
    timestamp: params.timestamp,
    canonicalBody: params.canonicalBody,
  });

  const a = Buffer.from(expected, "utf8");
  const b = Buffer.from(params.signature, "utf8");

  if (a.length !== b.length) return false;

  return crypto.timingSafeEqual(a, b);
}
