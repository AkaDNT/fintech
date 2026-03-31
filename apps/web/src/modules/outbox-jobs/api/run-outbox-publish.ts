import { apiRequest } from "@/shared/api/api-client";
import { ENDPOINTS } from "@/shared/api/endpoints";
import type { OutboxPublishRunResponse } from "@/modules/outbox-jobs/types/outbox-jobs.types";

export function runOutboxPublish() {
  return apiRequest<OutboxPublishRunResponse>(
    ENDPOINTS.admin.outbox.runPublish,
    {
      method: "POST",
    },
  );
}
