"use client";

import { useMutation } from "@tanstack/react-query";
import { ensureWalletsByUserId } from "@/modules/wallets/api/ensure-wallets";
import { useToastError } from "@/shared/hooks/use-toast-error";
import { toast } from "sonner";

export function useEnsureWallets() {
  const toastError = useToastError();

  return useMutation({
    mutationFn: ensureWalletsByUserId,
    onSuccess: () => {
      toast.success("Wallet provisioning completed");
    },
    onError: (error) => {
      toastError(error, "Cannot ensure wallets");
    },
  });
}
