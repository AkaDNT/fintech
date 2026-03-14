import { apiRequest } from "@/shared/api/api-client";
import { ENDPOINTS } from "@/shared/api/endpoints";

export function refresh() {
  return apiRequest<{ accessToken: string }>(ENDPOINTS.auth.refresh, {
    method: "POST",
  });
}
