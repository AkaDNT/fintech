import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import {
  PaymentProvider,
  ProviderCreatePaymentResult,
} from './payment-provider.port';

@Injectable()
export class StripePaymentProvider implements PaymentProvider {
  readonly name = 'stripe' as const;

  private readonly stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2026-03-25.dahlia',
  });

  async createPayment(params: {
    paymentId: string;
    merchantRef?: string | null;
    amount: string;
    currency: 'VND' | 'USD';
    description?: string | null;
  }): Promise<ProviderCreatePaymentResult> {
    const merchantRef = params.merchantRef ?? `PAY_${params.paymentId}`;

    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: Number(params.amount),
      currency: params.currency.toLowerCase(),
      description: params.description ?? undefined,
      metadata: {
        paymentId: params.paymentId,
        merchantRef,
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return {
      merchantRef,
      externalRef: paymentIntent.id,
      clientSecret: paymentIntent.client_secret ?? null,
      raw: {
        id: paymentIntent.id,
        status: paymentIntent.status,
        clientSecret: paymentIntent.client_secret ?? null,
      },
    };
  }
}
