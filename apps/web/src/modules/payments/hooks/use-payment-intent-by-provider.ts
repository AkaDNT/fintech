"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPaymentIntentByProvider } from "@/modules/payments/api/create-payment-intent-by-provider";
import type { CreatePaymentIntentRequest } from "@/modules/payments/types/payment.types";
import { QUERY_KEYS } from "@/shared/constants/query-keys";
import { useToastError } from "@/shared/hooks/use-toast-error";
import { toast } from "sonner";

export function usePaymentIntentByProvider() {
  const queryClient = useQueryClient();
  const toastError = useToastError();

  return useMutation({
    mutationFn: ({
      provider,
      body,
    }: {
      provider: string;
      body: CreatePaymentIntentRequest;
    }) => createPaymentIntentByProvider(provider, body),
    onSuccess: async (result, variables) => {
      toast.success("Payment intent created", {
        description: `Payment ID: ${result.paymentId} via ${variables.provider}`,
      });

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.paymentsBase }),
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.wallets }),
      ]);
    },
    onError: (error) => {
      toastError(error, "Cannot create provider payment intent");
    },
  });
}
