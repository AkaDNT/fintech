import { apiRequest } from "@/shared/api/api-client";
import { ENDPOINTS } from "@/shared/api/endpoints";
import type { WalletLedgerDto } from "@/modules/wallets/types/wallet.types";

export function getWalletLedger(
  walletId: string,
  cursor: string | null,
  limit = 20,
) {
  return apiRequest<WalletLedgerDto>(
    ENDPOINTS.wallets.ledger(walletId, cursor, limit),
  );
}
