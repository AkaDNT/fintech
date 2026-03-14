"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  creditWallet,
  type AdjustWalletRequest,
} from "@/modules/admin-wallets/api/credit-wallet";
import { debitWallet } from "@/modules/admin-wallets/api/debit-wallet";
import { QUERY_KEYS } from "@/shared/constants/query-keys";
import { toast } from "sonner";
import { useToastError } from "@/shared/hooks/use-toast-error";

export function useAdjustWallet(walletId: string) {
  const queryClient = useQueryClient();
  const toastError = useToastError();

  return useMutation({
    mutationFn: async (input: {
      direction: "CREDIT" | "DEBIT";
      payload: AdjustWalletRequest;
    }) => {
      if (input.direction === "CREDIT") {
        return creditWallet(walletId, input.payload);
      }
      return debitWallet(walletId, input.payload);
    },
    onSuccess: async () => {
      toast.success("Wallet adjusted");
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.wallets });
    },
    onError: (error) => {
      toastError(error, "Cannot adjust wallet");
    },
  });
}
