import { useMutation, useQueryClient } from "@tanstack/react-query";
import { runWebhookDeliveries } from "@/modules/webhook-deliveries/api/run-webhook-deliveries";
import { QUERY_KEYS } from "@/shared/constants/query-keys";
import { useToastError } from "@/shared/hooks/use-toast-error";
import { toast } from "sonner";

export function useTriggerWebhookRun() {
  const queryClient = useQueryClient();
  const toastError = useToastError();

  return useMutation({
    mutationFn: () => runWebhookDeliveries(),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.webhookDeliveriesBase],
      });
      toast.success(`Job ${data.jobId} started to process pending deliveries`);
    },
    onError: (error) => {
      toastError(error, "Failed to trigger webhook delivery run");
    },
  });
}
