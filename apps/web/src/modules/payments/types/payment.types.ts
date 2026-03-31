export type PaymentCurrency = "VND" | "USD";
export type PaymentProvider = "stripe" | "paypal" | "wise" | "flutterwave";

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
  status: string;
  merchantRef: string | null;
  externalRef: string | null;
  description: string | null;
  createdAt: string;
}

export interface PaymentDto {
  id: string;
  userId?: string;
  walletId: string;
  currency: PaymentCurrency;
  amount: string;
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
}

export interface ExpireHoldsResponse {
  ok?: boolean;
  jobId?: string;
  state?: string;
  [key: string]: unknown;
}
