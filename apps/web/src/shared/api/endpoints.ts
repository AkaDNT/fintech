export const ENDPOINTS = {
  health: "/health",
  internal: {
    observability: {
      metrics: "/internal/observability/metrics",
    },
  },
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
    createIntentByProvider: (provider: string) =>
      `/payments/intents/${encodeURIComponent(provider)}`,
    createTopUpIntentByProvider: (provider: string) =>
      `/payments/topups/intents/${encodeURIComponent(provider)}`,
    detail: (paymentId: string) => `/payments/${paymentId}`,
    hold: (paymentId: string) => `/payments/${paymentId}/hold`,
    capture: (paymentId: string) => `/payments/${paymentId}/capture`,
    settleTopUp: (paymentId: string) => `/payments/${paymentId}/topup/settle`,
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
      users: (params?: { date?: string; from?: string; to?: string }) => {
        const searchParams = new URLSearchParams();
        if (params?.date) searchParams.set("date", params.date);
        if (params?.from) searchParams.set("from", params.from);
        if (params?.to) searchParams.set("to", params.to);
        return `/admin/reports/users${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;
      },
      usersFiles: (limit = 10) => `/admin/reports/users/files?limit=${limit}`,
      usersFileDownload: (id: string) =>
        `/admin/reports/users/files/${encodeURIComponent(id)}/download`,
      reconcile: (currency?: string) =>
        `/admin/reports/reconcile${currency ? `?currency=${encodeURIComponent(currency)}` : ""}`,
      status: (id: string) => `/admin/reports/jobs/${id}`,
    },
    ledger: {
      tx: (txId: string) => `/admin/ledger/transactions/${txId}`,
    },
    webhooks: {
      list: (params?: {
        q?: string;
        status?: "ACTIVE" | "DISABLED";
        eventType?: string;
      }) => {
        const searchParams = new URLSearchParams();
        if (params?.q) searchParams.set("q", params.q);
        if (params?.status) searchParams.set("status", params.status);
        if (params?.eventType) searchParams.set("eventType", params.eventType);
        return `/admin/webhook-endpoints${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;
      },
      create: "/admin/webhook-endpoints",
      detail: (endpointId: string) => `/admin/webhook-endpoints/${endpointId}`,
      enable: (endpointId: string) =>
        `/admin/webhook-endpoints/${endpointId}/enable`,
      disable: (endpointId: string) =>
        `/admin/webhook-endpoints/${endpointId}/disable`,
      rotateSecret: (endpointId: string) =>
        `/admin/webhook-endpoints/${endpointId}/rotate-secret`,
    },
    webhookDeliveries: {
      list: "/admin/webhook-deliveries",
      detail: (deliveryId: string) => `/admin/webhook-deliveries/${deliveryId}`,
      retry: (deliveryId: string) =>
        `/admin/webhook-deliveries/${deliveryId}/retry`,
      replayDead: "/admin/webhook-deliveries/replay-dead",
      run: "/admin/webhook-deliveries/run",
    },
    outbox: {
      runPublish: "/admin/outbox/publish/run",
    },
    observability: {
      summary: "/admin/observability/summary",
    },
  },
} as const;
