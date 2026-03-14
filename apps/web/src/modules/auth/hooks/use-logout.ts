"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logout } from "@/modules/auth/api/logout";
import { clearAccessToken } from "@/modules/auth/utils/auth-storage";
import { QUERY_KEYS } from "@/shared/constants/query-keys";

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,
    onSettled: () => {
      clearAccessToken();
      queryClient.removeQueries({ queryKey: QUERY_KEYS.me });
    },
  });
}
