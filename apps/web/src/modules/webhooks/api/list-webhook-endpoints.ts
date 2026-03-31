import { apiRequest } from "@/shared/api/api-client";
import { ENDPOINTS } from "@/shared/api/endpoints";
import type {
  WebhookEndpointListItem,
  WebhookEndpointQuery,
} from "@/modules/webhooks/types/webhook.types";

export function listWebhookEndpoints(params?: WebhookEndpointQuery) {
  const url = ENDPOINTS.admin.webhooks.list(params);
  return apiRequest<WebhookEndpointListItem[]>(url, {
    method: "GET",
  });
}
