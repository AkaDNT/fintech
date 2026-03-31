"use client";

import { useQuery } from "@tanstack/react-query";
import { getObservabilitySummary } from "@/modules/observability/api/get-observability-summary";
import { QUERY_KEYS } from "@/shared/constants/query-keys";

export interface UseObservabilitySummaryOptions {
  enabled?: boolean;
  refetchIntervalMs?: number | false;
}

export function useObservabilitySummary(
  options?: UseObservabilitySummaryOptions,
) {
  return useQuery({
    queryKey: QUERY_KEYS.observabilitySummary,
    queryFn: () => getObservabilitySummary(),
    enabled: options?.enabled ?? true,
    refetchInterval: options?.refetchIntervalMs ?? 10000,
  });
}
