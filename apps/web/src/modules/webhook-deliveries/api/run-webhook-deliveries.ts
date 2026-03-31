import { apiRequest } from "@/shared/api/api-client";
import { ENDPOINTS } from "@/shared/api/endpoints";
import type { RunWebhookDeliveriesResponse } from "@/modules/webhook-deliveries/types/webhook-delivery.types";

export function runWebhookDeliveries() {
  return apiRequest<RunWebhookDeliveriesResponse>(
    ENDPOINTS.admin.webhookDeliveries.run,
    {
      method: "POST",
    },
  );
}
