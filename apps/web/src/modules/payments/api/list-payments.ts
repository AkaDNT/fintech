import { apiRequest } from "@/shared/api/api-client";
import { ENDPOINTS } from "@/shared/api/endpoints";
import type {
  PaymentDto,
  PaymentListFilters,
} from "@/modules/payments/types/payment.types";

export function listPayments(filters?: PaymentListFilters) {
  const params = new URLSearchParams();

  if (filters?.status) params.set("status", filters.status);
  if (filters?.currency) params.set("currency", filters.currency);
  if (filters?.merchantRef) params.set("merchantRef", filters.merchantRef);

  const query = params.toString();
  const path = query
    ? `${ENDPOINTS.payments.list}?${query}`
    : ENDPOINTS.payments.list;

  return apiRequest<PaymentDto[]>(path);
}

export function listAdminPayments(filters?: PaymentListFilters) {
  const params = new URLSearchParams();

  if (filters?.status) params.set("status", filters.status);
  if (filters?.currency) params.set("currency", filters.currency);
  if (filters?.merchantRef) params.set("merchantRef", filters.merchantRef);

  const query = params.toString();
  const path = query
    ? `${ENDPOINTS.admin.payments.list}?${query}`
    : ENDPOINTS.admin.payments.list;

  return apiRequest<PaymentDto[]>(path);
}
