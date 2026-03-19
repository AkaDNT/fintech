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
} as const;
