import { apiRequest } from "@/shared/api/api-client";
import { ENDPOINTS } from "@/shared/api/endpoints";
import type { AuthUser } from "@/modules/auth/types/auth.types";

export function me() {
  return apiRequest<{ user: AuthUser }>(ENDPOINTS.auth.me).then(
    (res) => res.user,
  );
}
