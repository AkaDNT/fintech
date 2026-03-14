"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTransfer } from "@/modules/transfers/api/create-transfer";
import { QUERY_KEYS } from "@/shared/constants/query-keys";
import { useToastError } from "@/shared/hooks/use-toast-error";
import { toast } from "sonner";

export function useCreateTransfer() {
  const queryClient = useQueryClient();
  const toastError = useToastError();

  return useMutation({
    mutationFn: createTransfer,
    onSuccess: async () => {
      toast.success("Transfer completed");
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.wallets });
    },
    onError: (error) => {
      toastError(error, "Transfer failed");
    },
  });
}
