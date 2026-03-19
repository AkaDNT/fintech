import { apiRequest } from "@/shared/api/api-client";
import { ENDPOINTS } from "@/shared/api/endpoints";
import type { PaymentDto } from "@/modules/payments/types/payment.types";

export function getPaymentDetail(paymentId: string) {
  return apiRequest<PaymentDto>(ENDPOINTS.payments.detail(paymentId));
}

export function getAdminPaymentDetail(paymentId: string) {
  return apiRequest<PaymentDto>(ENDPOINTS.admin.payments.detail(paymentId));
}
