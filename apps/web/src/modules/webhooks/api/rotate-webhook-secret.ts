import { apiRequest } from "@/shared/api/api-client";
import { ENDPOINTS } from "@/shared/api/endpoints";
import type {
  RotateSecretRequest,
  RotateSecretResponse,
} from "@/modules/webhooks/types/webhook.types";

export function rotateWebhookSecret(
  endpointId: string,
  body?: RotateSecretRequest,
) {
  return apiRequest<RotateSecretResponse>(
    ENDPOINTS.admin.webhooks.rotateSecret(endpointId),
    {
      method: "PATCH",
      body: body || {},
    },
  );
}
