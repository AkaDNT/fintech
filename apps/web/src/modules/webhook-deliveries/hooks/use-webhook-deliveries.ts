import { useQuery } from "@tanstack/react-query";
import { listWebhookDeliveries } from "@/modules/webhook-deliveries/api/list-webhook-deliveries";
import { QUERY_KEYS } from "@/shared/constants/query-keys";
import type { WebhookDeliveryListFilters } from "@/modules/webhook-deliveries/types/webhook-delivery.types";

export function useWebhookDeliveries(filters?: WebhookDeliveryListFilters) {
  return useQuery({
    queryKey: [
      QUERY_KEYS.webhookDeliveriesBase,
      filters?.endpointId,
      filters?.status,
      filters?.eventType,
      filters?.q,
    ],
    queryFn: () => listWebhookDeliveries(filters),
  });
}
