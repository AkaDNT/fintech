"use client";

import { useSyncExternalStore } from "react";
import { useQuery } from "@tanstack/react-query";
import { me } from "@/modules/auth/api/me";
import { QUERY_KEYS } from "@/shared/constants/query-keys";
import {
  getAccessTokenSnapshot,
  subscribeAccessTokenChanges,
} from "@/modules/auth/utils/auth-storage";

export function useMe() {
  const token = useSyncExternalStore(
    subscribeAccessTokenChanges,
    getAccessTokenSnapshot,
    () => null,
  );

  return useQuery({
    queryKey: [...QUERY_KEYS.me, token ?? "anonymous"],
    queryFn: me,
    enabled: Boolean(token),
    retry: false,
    staleTime: 60_000,
    refetchOnMount: false,
  });
}
