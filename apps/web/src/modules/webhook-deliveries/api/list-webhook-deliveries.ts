import { apiRequest } from "@/shared/api/api-client";
import { ENDPOINTS } from "@/shared/api/endpoints";
import type {
  WebhookDeliveryDto,
  WebhookDeliveryListFilters,
} from "@/modules/webhook-deliveries/types/webhook-delivery.types";

export function listWebhookDeliveries(filters?: WebhookDeliveryListFilters) {
  const params = new URLSearchParams();
  if (filters?.endpointId) params.set("endpointId", filters.endpointId);
  if (filters?.status) params.set("status", filters.status);
  if (filters?.eventType) params.set("eventType", filters.eventType);
  if (filters?.q) params.set("q", filters.q);

  const url =
    ENDPOINTS.admin.webhookDeliveries.list +
    (params.toString() ? `?${params}` : "");

  return apiRequest<WebhookDeliveryDto[]>(url, {
    method: "GET",
  });
}
