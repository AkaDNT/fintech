import { apiRequest } from "@/shared/api/api-client";
import { ENDPOINTS } from "@/shared/api/endpoints";

export interface AdjustWalletRequest {
  amount: string;
  reason?: string;
}

export function creditWallet(walletId: string, body: AdjustWalletRequest) {
  return apiRequest<{ adjustmentTxId: string }>(
    ENDPOINTS.admin.wallets.credit(walletId),
    {
      method: "POST",
      body,
    },
  );
}
