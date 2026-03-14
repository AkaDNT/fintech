"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { register } from "@/modules/auth/api/register";
import { setAccessToken } from "@/modules/auth/utils/auth-storage";
import { QUERY_KEYS } from "@/shared/constants/query-keys";
import { useToastError } from "@/shared/hooks/use-toast-error";

export function useRegister() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const toastError = useToastError();

  return useMutation({
    mutationFn: register,
    onSuccess: async (result) => {
      setAccessToken(result.accessToken);
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.me });
      router.replace(result.user.role === "ADMIN" ? "/dashboard" : "/wallets");
    },
    onError: (error) => {
      toastError(error, "Cannot create account");
    },
  });
}
