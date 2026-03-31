"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { runOutboxPublish } from "@/modules/outbox-jobs/api/run-outbox-publish";
import { QUERY_KEYS } from "@/shared/constants/query-keys";
import { useToastError } from "@/shared/hooks/use-toast-error";
import { toast } from "sonner";

export function useRunOutboxPublish() {
  const queryClient = useQueryClient();
  const toastError = useToastError();

  return useMutation({
    mutationFn: () => runOutboxPublish(),
    onSuccess: async (data) => {
      toast.success("Outbox publish job enqueued", {
        description: `Job ID: ${data.jobId}`,
      });

      await queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.observabilitySummary,
      });
    },
    onError: (error) => {
      toastError(error, "Cannot enqueue outbox publish job");
    },
  });
}
