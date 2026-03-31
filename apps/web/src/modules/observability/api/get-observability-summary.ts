import { apiRequest } from "@/shared/api/api-client";
import { ENDPOINTS } from "@/shared/api/endpoints";
import type { ObservabilitySummary } from "@/modules/observability/types/observability.types";

export function getObservabilitySummary() {
  return apiRequest<ObservabilitySummary>(
    ENDPOINTS.admin.observability.summary,
    {
      method: "GET",
    },
  );
}
