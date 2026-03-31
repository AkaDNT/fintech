import { apiRequest } from "@/shared/api/api-client";
import { ENDPOINTS } from "@/shared/api/endpoints";
import type { WebhookEndpointDetail } from "@/modules/webhooks/types/webhook.types";

export function getWebhookEndpoint(endpointId: string) {
  return apiRequest<WebhookEndpointDetail>(
    ENDPOINTS.admin.webhooks.detail(endpointId),
    {
      method: "GET",
    },
  );
}
