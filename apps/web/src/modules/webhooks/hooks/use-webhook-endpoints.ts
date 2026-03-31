"use client";

import { useQuery } from "@tanstack/react-query";
import { listWebhookEndpoints } from "@/modules/webhooks/api/list-webhook-endpoints";
import { QUERY_KEYS } from "@/shared/constants/query-keys";
import type { WebhookEndpointQuery } from "@/modules/webhooks/types/webhook.types";

export function useWebhookEndpoints(params?: WebhookEndpointQuery) {
  return useQuery({
    queryKey: [...QUERY_KEYS.webhookEndpointsBase, params],
    queryFn: () => listWebhookEndpoints(params),
  });
}
