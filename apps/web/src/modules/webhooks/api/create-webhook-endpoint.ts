import { apiRequest } from "@/shared/api/api-client";
import { ENDPOINTS } from "@/shared/api/endpoints";
import type {
  CreateWebhookEndpointRequest,
  WebhookEndpointDto,
} from "@/modules/webhooks/types/webhook.types";

export function createWebhookEndpoint(body: CreateWebhookEndpointRequest) {
  return apiRequest<WebhookEndpointDto>(ENDPOINTS.admin.webhooks.create, {
    method: "POST",
    body,
  });
}
