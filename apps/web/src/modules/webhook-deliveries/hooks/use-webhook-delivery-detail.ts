import { useQuery } from "@tanstack/react-query";
import { getWebhookDelivery } from "@/modules/webhook-deliveries/api/get-webhook-delivery";
import { QUERY_KEYS } from "@/shared/constants/query-keys";

export function useWebhookDeliveryDetail(deliveryId?: string) {
  return useQuery({
    queryKey: deliveryId
      ? QUERY_KEYS.webhookDeliveryDetail(deliveryId)
      : ["webhook-delivery-detail", "missing"],
    queryFn: () => getWebhookDelivery(deliveryId!),
    enabled: !!deliveryId,
  });
}
