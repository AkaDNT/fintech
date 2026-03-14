"use client";

import { useQuery } from "@tanstack/react-query";
import { getJobStatus } from "@/modules/admin-reports/api/get-job-status";
import { QUERY_KEYS } from "@/shared/constants/query-keys";

export function useJobStatus(jobId: string | null) {
  return useQuery({
    queryKey: QUERY_KEYS.reportJob(jobId ?? "none"),
    queryFn: () => getJobStatus(jobId as string),
    enabled: Boolean(jobId),
    refetchInterval: (query) => {
      const state = query.state.data?.state;
      if (!state) return 2000;
      if (["completed", "failed"].includes(state)) return false;
      return 2000;
    },
  });
}
