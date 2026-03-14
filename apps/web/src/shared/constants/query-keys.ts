export const QUERY_KEYS = {
  me: ["auth", "me"] as const,
  wallets: ["wallets"] as const,
  walletLedger: (walletId: string, cursor: string | null) =>
    ["wallet-ledger", walletId, cursor] as const,
  reportJob: (id: string) => ["report-job", id] as const,
} as const;
