import type { ApiError } from "@/shared/types/api.types";

export class ApiClientError extends Error implements ApiError {
  status: number;
  code: string;
  details: unknown;
  traceId: string | null;

  constructor(params: ApiError) {
    super(params.message);
    this.name = "ApiClientError";
    this.status = params.status;
    this.code = params.code;
    this.details = params.details;
    this.traceId = params.traceId;
  }
}
