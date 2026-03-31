import { apiRequest } from "@/shared/api/api-client";
import { ENDPOINTS } from "@/shared/api/endpoints";
import type { RetryWebhookDeliveryResponse } from "@/modules/webhook-deliveries/types/webhook-delivery.types";

export function retryWebhookDelivery(deliveryId: string) {
  return apiRequest<RetryWebhookDeliveryResponse>(
    ENDPOINTS.admin.webhookDeliveries.retry(deliveryId),
    {
      method: "POST",
    },
  );
}
