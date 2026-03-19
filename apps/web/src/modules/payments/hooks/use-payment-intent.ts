"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPaymentIntent } from "@/modules/payments/api/create-payment-intent";
import { QUERY_KEYS } from "@/shared/constants/query-keys";
import { useToastError } from "@/shared/hooks/use-toast-error";
import { toast } from "sonner";

export function usePaymentIntent() {
  const queryClient = useQueryClient();
  const toastError = useToastError();

  return useMutation({
    mutationFn: createPaymentIntent,
    onSuccess: async (result) => {
      toast.success("Payment intent created", {
        description: `Payment ID: ${result.paymentId}`,
      });

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.paymentsBase }),
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.wallets }),
      ]);
    },
    onError: (error) => {
      toastError(error, "Cannot create payment intent");
    },
  });
}
