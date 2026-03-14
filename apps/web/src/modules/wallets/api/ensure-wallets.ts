import { apiRequest } from "@/shared/api/api-client";
import { ENDPOINTS } from "@/shared/api/endpoints";

export function ensureWalletsByUserId(userId: string) {
  return apiRequest<void>(ENDPOINTS.wallets.ensureByUserId(userId), {
    method: "POST",
  });
}
