import { apiRequest } from "@/shared/api/api-client";
import { ENDPOINTS } from "@/shared/api/endpoints";

export function logout() {
  return apiRequest<{ ok: boolean }>(ENDPOINTS.auth.logout, {
    method: "POST",
  });
}
