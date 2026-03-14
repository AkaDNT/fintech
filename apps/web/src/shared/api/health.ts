import { ENV } from "@/shared/config/env";
import { ApiClientError } from "@/shared/api/api-error";

export interface HealthResponse {
  status: string;
  uptime?: number;
  service?: string;
  [key: string]: unknown;
}

export async function getHealth() {
  const response = await fetch(`${ENV.apiBaseUrl}/health`, {
    method: "GET",
    credentials: "include",
  });

  const payload = (await response
    .json()
    .catch(() => null)) as HealthResponse | null;

  if (!response.ok || !payload) {
    throw new ApiClientError({
      status: response.status,
      code: "HEALTH_CHECK_FAILED",
      message: "Health check request failed",
      details: payload,
      traceId: null,
    });
  }

  return payload;
}
