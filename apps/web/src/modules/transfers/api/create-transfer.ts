import { apiRequest } from "@/shared/api/api-client";
import { ENDPOINTS } from "@/shared/api/endpoints";
import { createIdempotencyKey } from "@/shared/lib/idempotency";
import type {
  CreateTransferRequest,
  CreateTransferResponse,
} from "@/modules/transfers/types/transfer.types";

export function createTransfer(body: CreateTransferRequest) {
  return apiRequest<CreateTransferResponse>(ENDPOINTS.transfers.create, {
    method: "POST",
    body,
    headers: {
      "idempotency-key": createIdempotencyKey("transfer"),
    },
  });
}
