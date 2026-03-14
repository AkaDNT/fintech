import { apiRequest } from "@/shared/api/api-client";
import { ENDPOINTS } from "@/shared/api/endpoints";
import type { WalletDto } from "@/modules/wallets/types/wallet.types";

export function getWallets() {
  return apiRequest<WalletDto[]>(ENDPOINTS.wallets.list);
}
