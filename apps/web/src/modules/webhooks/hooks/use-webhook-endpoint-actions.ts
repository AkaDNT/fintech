"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { enableWebhookEndpoint } from "@/modules/webhooks/api/enable-webhook-endpoint";
import { disableWebhookEndpoint } from "@/modules/webhooks/api/disable-webhook-endpoint";
import { rotateWebhookSecret } from "@/modules/webhooks/api/rotate-webhook-secret";
import { QUERY_KEYS } from "@/shared/constants/query-keys";
import { useToastError } from "@/shared/hooks/use-toast-error";
import { toast } from "sonner";

export function useEnableWebhookEndpoint() {
  const queryClient = useQueryClient();
  const toastError = useToastError();

  return useMutation({
    mutationFn: enableWebhookEndpoint,
    onSuccess: async () => {
      toast.success("Webhook endpoint enabled");
      await queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.webhookEndpointsBase,
      });
    },
    onError: (error) => {
      toastError(error, "Cannot enable webhook endpoint");
    },
  });
}

export function useDisableWebhookEndpoint() {
  const queryClient = useQueryClient();
  const toastError = useToastError();

  return useMutation({
    mutationFn: disableWebhookEndpoint,
    onSuccess: async () => {
      toast.success("Webhook endpoint disabled");
      await queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.webhookEndpointsBase,
      });
    },
    onError: (error) => {
      toastError(error, "Cannot disable webhook endpoint");
    },
  });
}

export function useRotateWebhookSecret() {
  const queryClient = useQueryClient();
  const toastError = useToastError();

  return useMutation({
    mutationFn: ({ id, body }: { id: string; body?: { secret?: string } }) =>
      rotateWebhookSecret(id, body),
    onSuccess: async (result) => {
      toast.success("Webhook secret rotated", {
        description: "New secret: " + result.secret.substring(0, 8) + "...",
      });
      await queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.webhookEndpointsBase,
      });
    },
    onError: (error) => {
      toastError(error, "Cannot rotate webhook secret");
    },
  });
}
