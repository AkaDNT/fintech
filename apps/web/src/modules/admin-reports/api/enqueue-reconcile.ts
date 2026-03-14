import { apiRequest } from "@/shared/api/api-client";
import { ENDPOINTS } from "@/shared/api/endpoints";
import type { Currency } from "@/shared/types/common.types";

export function enqueueReconcile(currency?: Currency) {
  return apiRequest<{ jobId: string }>(
    ENDPOINTS.admin.reports.reconcile(currency),
    {
      method: "POST",
    },
  );
}
