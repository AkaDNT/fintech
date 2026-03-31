import { useMutation, useQueryClient } from "@tanstack/react-query";
import { replayDeadDeliveries } from "@/modules/webhook-deliveries/api/replay-dead-deliveries";
import { QUERY_KEYS } from "@/shared/constants/query-keys";
import { useToastError } from "@/shared/hooks/use-toast-error";
import { toast } from "sonner";
import type { ReplayDeadDto } from "@/modules/webhook-deliveries/types/webhook-delivery.types";

export function useReplayDeadDeliveries() {
  const queryClient = useQueryClient();
  const toastError = useToastError();

  return useMutation({
    mutationFn: (params: ReplayDeadDto) => replayDeadDeliveries(params),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.webhookDeliveriesBase],
      });
      toast.success(
        `${data.replayed} dead-lettered deliveries queued for replay`,
      );
    },
    onError: (error) => {
      toastError(error, "Failed to replay dead-lettered deliveries");
    },
  });
}
