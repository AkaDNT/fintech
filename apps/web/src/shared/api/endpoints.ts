export const ENDPOINTS = {
  health: "/health",
  auth: {
    createUser: "/auth/create-user",
    register: "/auth/register",
    login: "/auth/login",
    refresh: "/auth/refresh",
    logout: "/auth/logout",
    me: "/auth/me",
  },
  wallets: {
    list: "/wallets",
    ensureByUserId: (userId: string) => `/wallets/${userId}`,
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
  payments: {
    list: "/payments",
    createIntent: "/payments/intents",
    detail: (paymentId: string) => `/payments/${paymentId}`,
    hold: (paymentId: string) => `/payments/${paymentId}/hold`,
    capture: (paymentId: string) => `/payments/${paymentId}/capture`,
    cancel: (paymentId: string) => `/payments/${paymentId}/cancel`,
    refund: (paymentId: string) => `/payments/${paymentId}/refund`,
  },
  admin: {
    payments: {
      list: "/admin/payments",
      detail: (paymentId: string) => `/admin/payments/${paymentId}`,
      expireHolds: "/admin/payments/expire-holds/run",
    },
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
