import { HttpStatus, Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { AppException } from 'src/common/errors/app.exception';
import { ERROR_CODES } from 'src/common/errors/error-codes';
import {
  InboundWebhookVerifier,
  VerifiedInboundWebhook,
} from './inbound-webhook-verifier.port';
import { Prisma } from '@prisma/client';

@Injectable()
export class StripeProviderVerifier implements InboundWebhookVerifier {
  readonly source = 'stripe';

  private readonly stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2026-03-25.dahlia',
  });

  async verify(params: {
    headers: Record<string, string | string[] | undefined>;
    rawBody: string;
  }): Promise<VerifiedInboundWebhook> {
    const signature = String(params.headers['stripe-signature'] ?? '');
    const secret = process.env.STRIPE_WEBHOOK_SECRET!;

    if (!signature) {
      throw new AppException(
        {
          code: ERROR_CODES.WEBHOOK_SIGNATURE_INVALID,
          message: 'Missing Stripe-Signature header',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    let event: Stripe.Event;
    try {
      event = this.stripe.webhooks.constructEvent(
        params.rawBody,
        signature,
        secret,
      );
    } catch {
      throw new AppException(
        {
          code: ERROR_CODES.WEBHOOK_SIGNATURE_INVALID,
          message: 'Invalid Stripe webhook signature',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    return {
      externalId: event.id,
      eventType: event.type,
      payload: event as unknown as Prisma.InputJsonValue,
      occurredAt: new Date(event.created * 1000).toISOString(),
    };
  }
}
