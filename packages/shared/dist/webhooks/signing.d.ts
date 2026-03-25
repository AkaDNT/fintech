export declare function canonicalizeWebhookBody(body: Record<string, unknown>): string;
export declare function createWebhookSigningBase(params: {
    timestamp: string;
    canonicalBody: string;
}): string;
export declare function signWebhookPayload(params: {
    secret: string;
    timestamp: string;
    canonicalBody: string;
}): string;
export declare function verifyWebhookSignature(params: {
    secret: string;
    timestamp: string;
    canonicalBody: string;
    signature: string;
}): boolean;
