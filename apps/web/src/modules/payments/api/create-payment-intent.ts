import { apiRequest } from "@/shared/api/api-client";
import { ENDPOINTS } from "@/shared/api/endpoints";
import { createIdempotencyKey } from "@/shared/lib/idempotency";
import type {
  CreatePaymentIntentRequest,
  CreatePaymentIntentResponse,
} from "@/modules/payments/types/payment.types";

export function createPaymentIntent(body: CreatePaymentIntentRequest) {
  return apiRequest<CreatePaymentIntentResponse>(
    ENDPOINTS.payments.createIntent,
    {
      method: "POST",
      body,
      headers: {
        "idempotency-key": createIdempotencyKey("payment-intent"),
      },
    },
  );
}
