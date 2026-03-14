export interface ApiEnvelope<T> {
  data: T;
  traceId: string;
}

export interface ApiErrorEnvelope {
  error: {
    code: string;
    message: string;
    details: unknown;
  };
  traceId: string;
}

export interface ApiError {
  status: number;
  code: string;
  message: string;
  details: unknown;
  traceId: string | null;
}
