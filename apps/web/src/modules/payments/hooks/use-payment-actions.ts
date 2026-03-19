"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  cancelPayment,
  capturePayment,
  holdPayment,
  refundPayment,
  runExpireHoldsJob,
} from "@/modules/payments/api/payment-actions";
import { QUERY_KEYS } from "@/shared/constants/query-keys";
import { useToastError } from "@/shared/hooks/use-toast-error";
import { toast } from "sonner";

function useActionSuccess(queryClient: ReturnType<typeof useQueryClient>) {
  return async (status: string, paymentId: string) => {
    toast.success(`Payment ${status.toLowerCase()} successfully`, {
      description: `Payment ID: ${paymentId}`,
    });

    await Promise.all([
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.paymentsBase }),
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.adminPaymentsBase }),
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.paymentDetail(paymentId),
      }),
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.adminPaymentDetail(paymentId),
      }),
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.wallets }),
    ]);
  };
}

export function useHoldPayment() {
  const queryClient = useQueryClient();
  const toastError = useToastError();
  const onSuccess = useActionSuccess(queryClient);

  return useMutation({
    mutationFn: holdPayment,
    onSuccess: async (result) => {
      await onSuccess(result.status, result.paymentId);
    },
    onError: (error) => toastError(error, "Cannot hold payment"),
  });
}

export function useCapturePayment() {
  const queryClient = useQueryClient();
  const toastError = useToastError();
  const onSuccess = useActionSuccess(queryClient);

  return useMutation({
    mutationFn: capturePayment,
    onSuccess: async (result) => {
      await onSuccess(result.status, result.paymentId);
    },
    onError: (error) => toastError(error, "Cannot capture payment"),
  });
}

export function useCancelPayment() {
  const queryClient = useQueryClient();
  const toastError = useToastError();
  const onSuccess = useActionSuccess(queryClient);

  return useMutation({
    mutationFn: cancelPayment,
    onSuccess: async (result) => {
      await onSuccess(result.status, result.paymentId);
    },
    onError: (error) => toastError(error, "Cannot cancel payment"),
  });
}

export function useRefundPayment() {
  const queryClient = useQueryClient();
  const toastError = useToastError();
  const onSuccess = useActionSuccess(queryClient);

  return useMutation({
    mutationFn: refundPayment,
    onSuccess: async (result) => {
      await onSuccess(result.status, result.paymentId);
    },
    onError: (error) => toastError(error, "Cannot refund payment"),
  });
}

export function useRunExpireHoldsJob() {
  const queryClient = useQueryClient();
  const toastError = useToastError();

  return useMutation({
    mutationFn: runExpireHoldsJob,
    onSuccess: async () => {
      toast.success("Expire holds job started");
      await queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.adminPaymentsBase,
      });
    },
    onError: (error) => toastError(error, "Cannot run expire-holds job"),
  });
}
