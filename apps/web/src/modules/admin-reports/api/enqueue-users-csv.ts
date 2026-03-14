import { apiRequest } from "@/shared/api/api-client";
import { ENDPOINTS } from "@/shared/api/endpoints";

export function enqueueUsersCsv(date?: string) {
  return apiRequest<{ jobId: string }>(ENDPOINTS.admin.reports.users(date), {
    method: "POST",
  });
}
