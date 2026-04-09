import { apiRequest } from "@/shared/api/api-client";
import { ENDPOINTS } from "@/shared/api/endpoints";
import { createIdempotencyKey } from "@/shared/lib/idempotency";
import type {
  CreatePaymentIntentRequest,
  CreatePaymentIntentResponse,
} from "@/modules/payments/types/payment.types";

export function createTopUpIntentByProvider(
  provider: string,
  body: CreatePaymentIntentRequest,
) {
  return apiRequest<CreatePaymentIntentResponse>(
    ENDPOINTS.payments.createTopUpIntentByProvider(provider),
    {
      method: "POST",
      body,
      headers: {
        "idempotency-key": createIdempotencyKey(`topup-intent-${provider}`),
      },
    },
  );
}
