"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getAdminPaymentDetail,
  getPaymentDetail,
} from "@/modules/payments/api/get-payment-detail";
import { mapPayment } from "@/modules/payments/mappers/payment.mapper";
import { QUERY_KEYS } from "@/shared/constants/query-keys";

export function usePaymentDetail(paymentId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.paymentDetail(paymentId),
    queryFn: async () => {
      const data = await getPaymentDetail(paymentId);
      return mapPayment(data);
    },
    enabled: Boolean(paymentId),
  });
}

export function useAdminPaymentDetail(paymentId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.adminPaymentDetail(paymentId),
    queryFn: async () => {
      const data = await getAdminPaymentDetail(paymentId);
      return mapPayment(data);
    },
    enabled: Boolean(paymentId),
  });
}
