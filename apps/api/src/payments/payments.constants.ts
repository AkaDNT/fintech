export const PAYMENT_HOLD_TTL_MS = 15 * 60 * 1000;

export const STRIPE_TOPUP_LIMITS = {
  VND: {
    min: 10_000n,
    max: 50_000_000n,
  },
  USD: {
    // USD amount is sent in minor units (cents)
    min: 50n, // $0.50
    max: 99_999_999n, // $999,999.99
  },
} as const;
