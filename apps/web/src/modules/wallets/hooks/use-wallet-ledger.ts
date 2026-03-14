"use client";

import { useQuery } from "@tanstack/react-query";
import { getWalletLedger } from "@/modules/wallets/api/get-wallet-ledger";
import { QUERY_KEYS } from "@/shared/constants/query-keys";

export function useWalletLedger(walletId: string, cursor: string | null) {
  return useQuery({
    queryKey: QUERY_KEYS.walletLedger(walletId, cursor),
    queryFn: () => getWalletLedger(walletId, cursor),
    enabled: Boolean(walletId),
  });
}
