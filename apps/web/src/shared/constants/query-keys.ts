export const QUERY_KEYS = {
  me: ["auth", "me"] as const,
  wallets: ["wallets"] as const,
  paymentsBase: ["payments"] as const,
  paymentDetail: (paymentId: string) => ["payments", paymentId] as const,
  adminPaymentsBase: ["admin-payments"] as const,
  adminPaymentDetail: (paymentId: string) =>
    ["admin-payments", paymentId] as const,
  walletLedger: (walletId: string, cursor: string | null) =>
    ["wallet-ledger", walletId, cursor] as const,
  reportJob: (id: string) => ["report-job", id] as const,
  reportUsersCsvFiles: (limit: number) =>
    ["report-users-csv-files", limit] as const,
  webhookEndpointsBase: ["webhook-endpoints"] as const,
  webhookEndpointDetail: (endpointId: string) =>
    ["webhook-endpoint-detail", endpointId] as const,
  webhookDeliveriesBase: ["webhook-deliveries"] as const,
  webhookDeliveryDetail: (deliveryId: string) =>
    ["webhook-delivery-detail", deliveryId] as const,
  observabilitySummary: ["observability-summary"] as const,
  observabilityMetrics: ["observability-metrics"] as const,
} as const;
