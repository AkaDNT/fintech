"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.canonicalizeWebhookBody = canonicalizeWebhookBody;
exports.createWebhookSigningBase = createWebhookSigningBase;
exports.signWebhookPayload = signWebhookPayload;
exports.verifyWebhookSignature = verifyWebhookSignature;
const crypto = require("node:crypto");
const webhook_constants_1 = require("./webhook.constants");
function normalizeForSigning(value) {
    if (value === null ||
        typeof value === "string" ||
        typeof value === "number" ||
        typeof value === "boolean") {
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
        const obj = value;
        const sortedKeys = Object.keys(obj).sort();
        const out = {};
        for (const key of sortedKeys) {
            const v = obj[key];
            if (typeof v === "undefined")
                continue;
            out[key] = normalizeForSigning(v);
        }
        return out;
    }
    return String(value);
}
function canonicalizeWebhookBody(body) {
    return JSON.stringify(normalizeForSigning(body));
}
function createWebhookSigningBase(params) {
    return `${params.timestamp}.${params.canonicalBody}`;
}
function signWebhookPayload(params) {
    const base = createWebhookSigningBase({
        timestamp: params.timestamp,
        canonicalBody: params.canonicalBody,
    });
    const digest = crypto
        .createHmac("sha256", params.secret)
        .update(base, "utf8")
        .digest("hex");
    return `${webhook_constants_1.WEBHOOK_VERSION}=${digest}`;
}
function verifyWebhookSignature(params) {
    const expected = signWebhookPayload({
        secret: params.secret,
        timestamp: params.timestamp,
        canonicalBody: params.canonicalBody,
    });
    const a = Buffer.from(expected, "utf8");
    const b = Buffer.from(params.signature, "utf8");
    if (a.length !== b.length)
        return false;
    return crypto.timingSafeEqual(a, b);
}
