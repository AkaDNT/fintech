import { apiRequest } from "@/shared/api/api-client";
import { ENDPOINTS } from "@/shared/api/endpoints";
import type { AdjustWalletRequest } from "@/modules/admin-wallets/api/credit-wallet";

export function debitWallet(walletId: string, body: AdjustWalletRequest) {
  return apiRequest<{ adjustmentTxId: string }>(
    ENDPOINTS.admin.wallets.debit(walletId),
    {
      method: "POST",
      body,
    },
  );
}
