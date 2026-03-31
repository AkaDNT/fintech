export type WebhookEvent =
  | "payment.created"
  | "payment.held"
  | "payment.captured"
  | "payment.canceled"
  | "payment.refunded"
  | "payment.expired";

export type WebhookEndpointStatus = "ACTIVE" | "DISABLED";

export interface CreateWebhookEndpointRequest {
  name: string;
  targetUrl: string;
  secret?: string;
  eventTypes: WebhookEvent[];
}

export interface WebhookEndpointDto {
  id: string;
  name: string;
  targetUrl: string;
  eventTypes: string[];
  status: WebhookEndpointStatus;
  createdAt: string;
  updatedAt: string;
  generatedSecret: string;
}

export interface WebhookEndpointListItem {
  id: string;
  name: string;
  targetUrl: string;
  secretHint: string | null;
  eventTypes: string[];
  status: WebhookEndpointStatus;
  deliveriesCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface WebhookEndpointDetail extends WebhookEndpointListItem {
  deliveries: Array<{
    id: string;
    eventType: string;
    status: "PENDING" | "PROCESSING" | "SUCCEEDED" | "FAILED" | "DEAD";
    attemptCount: number;
    lastHttpStatus: number | null;
    createdAt: string;
    updatedAt: string;
  }>;
}

export interface RotateSecretRequest {
  secret?: string;
}

export interface RotateSecretResponse {
  id: string;
  rotated: boolean;
  secret: string;
}

export interface WebhookEndpointQuery {
  q?: string;
  status?: WebhookEndpointStatus;
  eventType?: string;
}
