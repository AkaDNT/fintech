export type WebhookDeliveryStatus =
  | "PENDING"
  | "PROCESSING"
  | "SUCCEEDED"
  | "FAILED"
  | "DEAD";

export type WebhookEndpointStatus = "ACTIVE" | "DISABLED";

export interface WebhookEndpointRef {
  id: string;
  name: string;
  targetUrl: string;
  status: WebhookEndpointStatus;
}

export interface WebhookDeliveryDto {
  id: string;
  endpointId: string;
  outboxEventId?: string | null;
  eventType: string;
  payload: Record<string, unknown>;
  signature?: string | null;
  status: WebhookDeliveryStatus;
  attemptCount: number;
  nextAttemptAt: string;
  lastHttpStatus?: number | null;
  lastError?: string | null;
  responseBody?: string | null;
  traceId?: string | null;
  createdAt: string;
  updatedAt: string;
  endpoint?: WebhookEndpointRef;
}

export interface WebhookDeliveryListFilters {
  endpointId?: string;
  status?: WebhookDeliveryStatus;
  eventType?: string;
  q?: string;
}

export interface RetryWebhookDeliveryResponse {
  id: string;
  status: WebhookDeliveryStatus;
  nextAttemptAt: string;
  updatedAt: string;
}

export interface ReplayDeadDto {
  endpointId?: string;
  eventType?: string;
  limit?: number;
}

export interface ReplayDeadResponse {
  replayed: number;
  ids: string[];
}

export interface RunWebhookDeliveriesResponse {
  jobId: string;
}

export interface WebhookDeliveriesPageFilters {
  endpoint?: string;
  status?: WebhookDeliveryStatus;
  eventType?: string;
  q?: string;
}
