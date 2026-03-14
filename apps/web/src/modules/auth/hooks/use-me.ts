"use client";

import { useQuery } from "@tanstack/react-query";
import { me } from "@/modules/auth/api/me";
import { QUERY_KEYS } from "@/shared/constants/query-keys";
import { getAccessToken } from "@/modules/auth/utils/auth-storage";

export function useMe() {
  const token = getAccessToken();

  return useQuery({
    queryKey: QUERY_KEYS.me,
    queryFn: me,
    enabled: Boolean(token),
    retry: false,
  });
}
