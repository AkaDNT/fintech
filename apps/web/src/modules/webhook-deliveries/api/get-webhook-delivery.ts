import { apiRequest } from "@/shared/api/api-client";
import { ENDPOINTS } from "@/shared/api/endpoints";
import type { WebhookDeliveryDto } from "@/modules/webhook-deliveries/types/webhook-delivery.types";

export function getWebhookDelivery(deliveryId: string) {
  return apiRequest<WebhookDeliveryDto>(
    ENDPOINTS.admin.webhookDeliveries.detail(deliveryId),
    {
      method: "GET",
    },
  );
}
