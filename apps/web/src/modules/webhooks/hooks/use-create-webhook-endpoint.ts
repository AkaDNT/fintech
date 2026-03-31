"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createWebhookEndpoint } from "@/modules/webhooks/api/create-webhook-endpoint";
import { QUERY_KEYS } from "@/shared/constants/query-keys";
import { useToastError } from "@/shared/hooks/use-toast-error";
import { toast } from "sonner";

export function useCreateWebhookEndpoint() {
  const queryClient = useQueryClient();
  const toastError = useToastError();

  return useMutation({
    mutationFn: createWebhookEndpoint,
    onSuccess: async (result) => {
      toast.success("Webhook endpoint registered", {
        description: `URL: ${result.targetUrl}`,
      });

      await queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.webhookEndpointsBase,
      });
    },
    onError: (error) => {
      toastError(error, "Cannot create webhook endpoint");
    },
  });
}
