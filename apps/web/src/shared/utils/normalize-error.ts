import { ApiClientError } from "@/shared/api/api-error";

export function normalizeError(error: unknown): ApiClientError {
  if (error instanceof ApiClientError) {
    return error;
  }

  if (error instanceof Error) {
    return new ApiClientError({
      status: 500,
      code: "UNKNOWN_ERROR",
      message: error.message,
      details: null,
      traceId: null,
    });
  }

  return new ApiClientError({
    status: 500,
    code: "UNKNOWN_ERROR",
    message: "Unexpected error",
    details: error,
    traceId: null,
  });
}
