import { useMutation, useQueryClient } from "@tanstack/react-query";
import { retryWebhookDelivery } from "@/modules/webhook-deliveries/api/retry-webhook-delivery";
import { QUERY_KEYS } from "@/shared/constants/query-keys";
import { useToastError } from "@/shared/hooks/use-toast-error";
import { toast } from "sonner";

export function useRetryWebhookDelivery() {
  const queryClient = useQueryClient();
  const toastError = useToastError();

  return useMutation({
    mutationFn: (deliveryId: string) => retryWebhookDelivery(deliveryId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.webhookDeliveriesBase],
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.webhookDeliveryDetail(data.id),
      });
      toast.success("Webhook delivery retry initiated successfully");
    },
    onError: (error) => {
      toastError(error, "Failed to retry webhook delivery");
    },
  });
}
