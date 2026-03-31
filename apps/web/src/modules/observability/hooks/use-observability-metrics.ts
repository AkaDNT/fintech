"use client";

import { useQuery } from "@tanstack/react-query";
import { getObservabilityMetrics } from "@/modules/observability/api/get-observability-metrics";
import { QUERY_KEYS } from "@/shared/constants/query-keys";

export interface UseObservabilityMetricsOptions {
  enabled?: boolean;
  refetchIntervalMs?: number | false;
}

export function useObservabilityMetrics(
  options?: UseObservabilityMetricsOptions,
) {
  return useQuery({
    queryKey: QUERY_KEYS.observabilityMetrics,
    queryFn: () => getObservabilityMetrics(),
    enabled: options?.enabled ?? true,
    refetchInterval: options?.refetchIntervalMs ?? 15000,
  });
}
