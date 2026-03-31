"use client";

import { useQuery } from "@tanstack/react-query";
import { getWebhookEndpoint } from "@/modules/webhooks/api/get-webhook-endpoint";

export function useWebhookEndpointDetail(endpointId: string) {
  return useQuery({
    queryKey: ["webhook-endpoint-detail", endpointId],
    queryFn: () => getWebhookEndpoint(endpointId),
    enabled: !!endpointId,
  });
}
