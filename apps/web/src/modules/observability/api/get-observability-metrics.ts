import { ApiClientError } from "@/shared/api/api-error";
import { ENDPOINTS } from "@/shared/api/endpoints";
import { ENV } from "@/shared/config/env";
import { getAccessToken } from "@/modules/auth/utils/auth-storage";

export async function getObservabilityMetrics() {
  const token = getAccessToken();
  const response = await fetch(
    `${ENV.apiBaseUrl}${ENDPOINTS.internal.observability.metrics}`,
    {
      method: "GET",
      credentials: "include",
      headers: {
        ...(token ? { authorization: `Bearer ${token}` } : {}),
        accept: "text/plain",
      },
    },
  );

  const text = await response.text();

  if (!response.ok) {
    throw new ApiClientError({
      status: response.status,
      code: "HTTP_ERROR",
      message: text || `Request failed with status ${response.status}`,
      details: null,
      traceId: null,
    });
  }

  return text;
}
