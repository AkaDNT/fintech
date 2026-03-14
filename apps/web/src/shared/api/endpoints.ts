export const ENDPOINTS = {
  auth: {
    login: "/auth/login",
    refresh: "/auth/refresh",
    logout: "/auth/logout",
    me: "/auth/me",
  },
  wallets: {
    list: "/wallets",
    ledger: (walletId: string, cursor?: string | null, limit = 20) => {
      const params = new URLSearchParams();
      if (cursor) params.set("cursor", cursor);
      params.set("limit", String(limit));
      return `/wallets/${walletId}/ledger?${params.toString()}`;
    },
  },
  transfers: {
    create: "/transfers",
  },
  admin: {
    wallets: {
      credit: (walletId: string) => `/admin/wallets/${walletId}/credit`,
      debit: (walletId: string) => `/admin/wallets/${walletId}/debit`,
    },
    reports: {
      users: (date?: string) =>
        `/admin/reports/users${date ? `?date=${encodeURIComponent(date)}` : ""}`,
      reconcile: (currency?: string) =>
        `/admin/reports/reconcile${currency ? `?currency=${encodeURIComponent(currency)}` : ""}`,
      status: (id: string) => `/admin/reports/jobs/${id}`,
    },
    ledger: {
      tx: (txId: string) => `/admin/ledger/transactions/${txId}`,
    },
  },
} as const;
