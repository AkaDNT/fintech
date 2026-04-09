export type PaymentCurrency = "VND" | "USD";
export type PaymentProvider = "stripe" | "paypal" | "wise" | "flutterwave";

export interface PaymentProviderData {
  checkoutUrl?: string | null;
  clientSecret?: string | null;
  payUrl?: string | null;
  deeplink?: string | null;
  qrCodeUrl?: string | null;
}

export interface CreatePaymentIntentRequest {
  walletId: string;
  amount: string;
  currency: PaymentCurrency;
  merchantRef?: string;
  externalRef?: string;
  description?: string;
}

export interface CreatePaymentIntentResponse {
  paymentId: string;
  walletId: string;
  amount: string;
  currency: PaymentCurrency;
  direction?: "DEBIT" | "CREDIT";
  status: string;
  merchantRef: string | null;
  externalRef: string | null;
  description: string | null;
  createdAt: string;
  provider?: PaymentProvider;
  providerData?: PaymentProviderData;
}

export interface PaymentDto {
  id: string;
  userId?: string;
  walletId: string;
  currency: PaymentCurrency;
  amount: string;
  direction?: "DEBIT" | "CREDIT";
  status: string;
  merchantRef: string | null;
  externalRef: string | null;
  description: string | null;
  ledgerTxId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  userId?: string;
  walletId: string;
  currency: PaymentCurrency;
  amount: bigint;
  direction?: "DEBIT" | "CREDIT";
  status: string;
  merchantRef: string | null;
  externalRef: string | null;
  description: string | null;
  ledgerTxId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentListFilters {
  status?: string;
  currency?: PaymentCurrency;
  merchantRef?: string;
}

export interface PaymentActionResponse {
  paymentId: string;
  status: string;
  amount?: string;
  currency?: PaymentCurrency;
  ledgerTxId?: string;
  refundTxId?: string;
  capturedAt?: string;
  createdAt?: string;
  walletBalance?: {
    availableBalance: string;
    lockedBalance: string;
  };
}

export interface ExpireHoldsResponse {
  ok?: boolean;
  jobId?: string;
  state?: string;
  [key: string]: unknown;
}
