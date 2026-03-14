import { apiRequest } from "@/shared/api/api-client";
import { ENDPOINTS } from "@/shared/api/endpoints";
import type { UserRole } from "@/shared/types/common.types";

export interface CreateUserRequest {
  email: string;
  password: string;
  role: UserRole;
}

export interface CreateUserResponse {
  user: {
    id: string;
    email: string;
    role: UserRole;
    status?: string;
  };
}

export function createUser(body: CreateUserRequest) {
  return apiRequest<CreateUserResponse>(ENDPOINTS.auth.createUser, {
    method: "POST",
    body,
  });
}
