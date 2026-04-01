import { apiRequest } from "@/shared/api/api-client";
import { ENDPOINTS } from "@/shared/api/endpoints";

export function enqueueUsersCsv(params?: {
  date?: string;
  from?: string;
  to?: string;
}) {
  return apiRequest<{ jobId: string }>(ENDPOINTS.admin.reports.users(params), {
    method: "POST",
  });
}
