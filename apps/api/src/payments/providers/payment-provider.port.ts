export type SupportedPaymentProvider = 'stripe' | 'payos' | 'momo';

export type ProviderCreatePaymentResult = {
  merchantRef?: string | null;
  externalRef?: string | null;

  // data for FE / redirect
  checkoutUrl?: string | null;
  clientSecret?: string | null;
  payUrl?: string | null;
  deeplink?: string | null;
  qrCodeUrl?: string | null;

  raw?: Record<string, unknown> | null;
};

export interface PaymentProvider {
  readonly name: SupportedPaymentProvider;

  createPayment(params: {
    paymentId: string;
    merchantRef?: string | null;
    amount: string; // minor units string
    currency: 'VND' | 'USD';
    description?: string | null;
  }): Promise<ProviderCreatePaymentResult>;
}
