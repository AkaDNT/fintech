import { apiRequest } from "@/shared/api/api-client";
import { ENDPOINTS } from "@/shared/api/endpoints";
import { createIdempotencyKey } from "@/shared/lib/idempotency";
import type { PaymentActionResponse } from "@/modules/payments/types/payment.types";

export function settleTopUp(paymentId: string) {
  return apiRequest<PaymentActionResponse>(
    ENDPOINTS.payments.settleTopUp(paymentId),
    {
      method: "POST",
      headers: {
        "idempotency-key": createIdempotencyKey(`topup-settle-${paymentId}`),
      },
    },
  );
}
