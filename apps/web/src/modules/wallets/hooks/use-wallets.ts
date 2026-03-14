"use client";

import { useQuery } from "@tanstack/react-query";
import { getWallets } from "@/modules/wallets/api/get-wallets";
import { mapWallet } from "@/modules/wallets/mappers/ledger.mapper";
import { QUERY_KEYS } from "@/shared/constants/query-keys";

export function useWallets() {
  return useQuery({
    queryKey: QUERY_KEYS.wallets,
    queryFn: async () => {
      const data = await getWallets();
      return data.map(mapWallet);
    },
  });
}
