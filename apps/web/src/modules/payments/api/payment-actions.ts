import { apiRequest } from "@/shared/api/api-client";
import { ENDPOINTS } from "@/shared/api/endpoints";
import { createIdempotencyKey } from "@/shared/lib/idempotency";
import type {
  ExpireHoldsResponse,
  PaymentActionResponse,
} from "@/modules/payments/types/payment.types";

export function holdPayment(paymentId: string) {
  return apiRequest<PaymentActionResponse>(ENDPOINTS.payments.hold(paymentId), {
    method: "POST",
    headers: {
      "idempotency-key": createIdempotencyKey("payment-hold"),
    },
  });
}

export function capturePayment(paymentId: string) {
  return apiRequest<PaymentActionResponse>(
    ENDPOINTS.payments.capture(paymentId),
    {
      method: "POST",
      headers: {
        "idempotency-key": createIdempotencyKey("payment-capture"),
      },
    },
  );
}

export function cancelPayment(paymentId: string) {
  return apiRequest<PaymentActionResponse>(
    ENDPOINTS.payments.cancel(paymentId),
    {
      method: "POST",
      headers: {
        "idempotency-key": createIdempotencyKey("payment-cancel"),
      },
    },
  );
}

export function refundPayment(paymentId: string) {
  return apiRequest<PaymentActionResponse>(
    ENDPOINTS.payments.refund(paymentId),
    {
      method: "POST",
      headers: {
        "idempotency-key": createIdempotencyKey("payment-refund"),
      },
    },
  );
}

export function runExpireHoldsJob() {
  return apiRequest<ExpireHoldsResponse>(ENDPOINTS.admin.payments.expireHolds, {
    method: "POST",
  });
}
