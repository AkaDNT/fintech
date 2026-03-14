import { apiRequest } from "@/shared/api/api-client";
import { ENDPOINTS } from "@/shared/api/endpoints";

export interface ReportJobStatus {
  id: string;
  name: string;
  state: string;
  progress: number;
  failedReason: string | null;
  returnValue: unknown;
  attemptsMade: number;
}

export function getJobStatus(id: string) {
  return apiRequest<ReportJobStatus>(ENDPOINTS.admin.reports.status(id));
}
