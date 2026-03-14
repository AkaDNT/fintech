"use client";

import { useMutation } from "@tanstack/react-query";
import { createUser } from "@/modules/auth/api/create-user";
import { useToastError } from "@/shared/hooks/use-toast-error";
import { toast } from "sonner";

export function useCreateUser() {
  const toastError = useToastError();

  return useMutation({
    mutationFn: createUser,
    onSuccess: (result) => {
      toast.success(`User ${result.user.email} created successfully`);
    },
    onError: (error) => {
      toastError(error, "Cannot create user");
    },
  });
}
