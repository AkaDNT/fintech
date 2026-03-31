import { apiRequest } from "@/shared/api/api-client";
import { ENDPOINTS } from "@/shared/api/endpoints";
import type {
  ReplayDeadDto,
  ReplayDeadResponse,
} from "@/modules/webhook-deliveries/types/webhook-delivery.types";

export function replayDeadDeliveries(body: ReplayDeadDto) {
  return apiRequest<ReplayDeadResponse>(
    ENDPOINTS.admin.webhookDeliveries.replayDead,
    {
      method: "POST",
      body,
    },
  );
}
