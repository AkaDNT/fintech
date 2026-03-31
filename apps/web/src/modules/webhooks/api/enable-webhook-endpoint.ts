import { apiRequest } from "@/shared/api/api-client";
import { ENDPOINTS } from "@/shared/api/endpoints";
import type { WebhookEndpointDto } from "@/modules/webhooks/types/webhook.types";

export function enableWebhookEndpoint(endpointId: string) {
  return apiRequest<WebhookEndpointDto>(
    ENDPOINTS.admin.webhooks.enable(endpointId),
    {
      method: "PATCH",
    },
  );
}
