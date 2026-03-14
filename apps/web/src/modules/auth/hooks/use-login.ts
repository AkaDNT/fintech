"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { login } from "@/modules/auth/api/login";
import { setAccessToken } from "@/modules/auth/utils/auth-storage";
import { QUERY_KEYS } from "@/shared/constants/query-keys";
import { useToastError } from "@/shared/hooks/use-toast-error";

export function useLogin() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const toastError = useToastError();

  return useMutation({
    mutationFn: login,
    onSuccess: async (result) => {
      setAccessToken(result.accessToken);
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.me });
      router.replace("/dashboard");
    },
    onError: (error) => {
      toastError(error, "Cannot sign in");
    },
  });
}
