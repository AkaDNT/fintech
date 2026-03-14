import { apiRequest } from "@/shared/api/api-client";
import { ENDPOINTS } from "@/shared/api/endpoints";
import type {
  LoginRequest,
  LoginResponse,
} from "@/modules/auth/types/auth.types";

export function login(body: LoginRequest) {
  return apiRequest<LoginResponse>(ENDPOINTS.auth.login, {
    method: "POST",
    body,
  });
}
