"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  listAdminPayments,
  listPayments,
} from "@/modules/payments/api/list-payments";
import { mapPayment } from "@/modules/payments/mappers/payment.mapper";
import { QUERY_KEYS } from "@/shared/constants/query-keys";
import type { PaymentListFilters } from "@/modules/payments/types/payment.types";

function makePaymentsKey(
  prefix: readonly string[],
  filters?: PaymentListFilters,
) {
  return [
    ...prefix,
    filters?.status ?? "ALL",
    filters?.currency ?? "ALL",
    filters?.merchantRef ?? "",
  ] as const;
}

export function usePayments(filters?: PaymentListFilters) {
  return useQuery({
    queryKey: makePaymentsKey(QUERY_KEYS.paymentsBase, filters),
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const data = await listPayments(filters);
      return data.map(mapPayment);
    },
  });
}

export function useAdminPayments(filters?: PaymentListFilters) {
  return useQuery({
    queryKey: makePaymentsKey(QUERY_KEYS.adminPaymentsBase, filters),
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const data = await listAdminPayments(filters);
      return data.map(mapPayment);
    },
  });
}
