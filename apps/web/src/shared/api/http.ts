import { ENV } from "@/shared/config/env";
import { ApiClientError } from "@/shared/api/api-error";
import type { ApiEnvelope, ApiErrorEnvelope } from "@/shared/types/api.types";

export interface HttpRequestOptions extends Omit<
  RequestInit,
  "body" | "headers"
> {
  path: string;
  token?: string | null;
  body?: unknown;
  headers?: HeadersInit;
}

async function parseJsonSafe(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export async function httpRequest<T>(options: HttpRequestOptions): Promise<T> {
  const { path, token, body, headers, ...init } = options;

  const response = await fetch(`${ENV.apiBaseUrl}${path}`, {
    ...init,
    credentials: "include",
    headers: {
      "content-type": "application/json",
      ...(token ? { authorization: `Bearer ${token}` } : {}),
      ...(headers ?? {}),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const payload = await parseJsonSafe(response);

  if (!response.ok) {
    const errorPayload = payload as ApiErrorEnvelope | null;
    throw new ApiClientError({
      status: response.status,
      code: errorPayload?.error?.code ?? "HTTP_ERROR",
      message:
        errorPayload?.error?.message ??
        `Request failed with status ${response.status}`,
      details: errorPayload?.error?.details ?? null,
      traceId: errorPayload?.traceId ?? null,
    });
  }

  const envelope = payload as ApiEnvelope<T> | null;

  if (!envelope || typeof envelope !== "object" || !("data" in envelope)) {
    throw new ApiClientError({
      status: response.status,
      code: "INVALID_ENVELOPE",
      message: "API response envelope is invalid",
      details: payload,
      traceId: null,
    });
  }

  return envelope.data;
}
