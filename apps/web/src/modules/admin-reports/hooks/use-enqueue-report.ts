"use client";

import { useMutation } from "@tanstack/react-query";
import { enqueueUsersCsv } from "@/modules/admin-reports/api/enqueue-users-csv";
import { enqueueReconcile } from "@/modules/admin-reports/api/enqueue-reconcile";
import { useToastError } from "@/shared/hooks/use-toast-error";

export function useEnqueueReport() {
  const toastError = useToastError();

  return useMutation({
    mutationFn: async (params: {
      kind: "USERS" | "RECONCILE";
      date?: string;
      from?: string;
      to?: string;
      currency?: "VND" | "USD";
    }) => {
      if (params.kind === "USERS") {
        return enqueueUsersCsv({
          date: params.date,
          from: params.from,
          to: params.to,
        });
      }

      return enqueueReconcile(params.currency);
    },
    onError: (error) => {
      toastError(error, "Cannot enqueue report");
    },
  });
}
