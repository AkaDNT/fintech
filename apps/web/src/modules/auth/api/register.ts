import { apiRequest } from "@/shared/api/api-client";
import { ENDPOINTS } from "@/shared/api/endpoints";
import type { LoginResponse } from "@/modules/auth/types/auth.types";

export interface RegisterRequest {
  email: string;
  password: string;
  confirmPassword: string;
}

export function register(body: RegisterRequest) {
  return apiRequest<LoginResponse>(ENDPOINTS.auth.register, {
    method: "POST",
    body,
  });
}
