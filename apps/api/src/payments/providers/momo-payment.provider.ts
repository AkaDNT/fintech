import { Inject, Injectable } from '@nestjs/common';
import {
  PaymentProvider,
  ProviderCreatePaymentResult,
} from './payment-provider.port';

export type MomoCreateOrderResult = {
  transId?: string | number | null;
  payUrl?: string | null;
  deeplink?: string | null;
  qrCodeUrl?: string | null;
  raw?: Record<string, unknown>;
};

export interface MomoGatewayClient {
  createOrder(params: {
    orderId: string;
    requestId: string;
    amount: string;
    orderInfo: string;
  }): Promise<MomoCreateOrderResult>;
}

export const MOMO_GATEWAY_CLIENT = Symbol('MOMO_GATEWAY_CLIENT');

@Injectable()
export class MomoPaymentProvider implements PaymentProvider {
  readonly name = 'momo' as const;

  constructor(
    @Inject(MOMO_GATEWAY_CLIENT)
    private readonly client: MomoGatewayClient,
  ) {}

  async createPayment(params: {
    paymentId: string;
    merchantRef?: string | null;
    amount: string;
    currency: 'VND' | 'USD';
    description?: string | null;
  }): Promise<ProviderCreatePaymentResult> {
    const merchantRef = params.merchantRef ?? params.paymentId;
    const requestId = `${merchantRef}-${Date.now()}`;

    const created = await this.client.createOrder({
      orderId: merchantRef,
      requestId,
      amount: params.amount,
      orderInfo: params.description ?? `PAY_${params.paymentId}`,
    });

    return {
      merchantRef,
      externalRef:
        created.transId !== undefined && created.transId !== null
          ? String(created.transId)
          : null,
      checkoutUrl: created.payUrl ?? null,
      deeplink: created.deeplink ?? null,
      qrCodeUrl: created.qrCodeUrl ?? null,
      raw: created.raw ?? (created as Record<string, unknown>),
    };
  }
}
