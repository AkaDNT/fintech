import type { ErrorCode } from "./error-codes";
export declare class DomainError extends Error {
    readonly code: ErrorCode;
    readonly details?: unknown | undefined;
    constructor(code: ErrorCode, message: string, details?: unknown | undefined);
}
