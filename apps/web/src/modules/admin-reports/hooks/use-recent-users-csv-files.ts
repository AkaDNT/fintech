"use client";

import { useQuery } from "@tanstack/react-query";
import { getRecentUsersCsvFiles } from "@/modules/admin-reports/api/get-recent-users-csv-files";
import { QUERY_KEYS } from "@/shared/constants/query-keys";

export function useRecentUsersCsvFiles(limit = 10) {
  return useQuery({
    queryKey: QUERY_KEYS.reportUsersCsvFiles(limit),
    queryFn: () => getRecentUsersCsvFiles(limit),
    refetchInterval: 10_000,
  });
}
