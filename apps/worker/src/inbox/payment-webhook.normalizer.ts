import { Injectable } from '@nestjs/common';
import { NormalizedInboundPaymentEvent } from './payment-webhook.types';

@Injectable()
export class PaymentWebhookNormalizer {
  normalize(params: {
    source: string;
    eventType: string;
    payload: Record<string, unknown>;
  }): NormalizedInboundPaymentEvent {
    const { source, eventType, payload } = params;

    switch (source) {
      case 'mock-gateway':
        return this.normalizeMock(eventType, payload);

      case 'stripe':
        return this.normalizeStripe(eventType, payload);

      case 'payos':
        return this.normalizePayos(eventType, payload);

      case 'momo':
        return this.normalizeMomo(eventType, payload);

      default:
        return {
          source,
          eventType,
          payload,
          correlation: {},
        };
    }
  }

  private normalizeMock(
    eventType: string,
    payload: Record<string, unknown>,
  ): NormalizedInboundPaymentEvent {
    const p = payload as any;

    return {
      source: 'mock-gateway',
      eventType,
      payload,
      correlation: {
        internalPaymentId: p.paymentId ? String(p.paymentId) : null,
        merchantRef: p.merchantRef ? String(p.merchantRef) : null,
        externalRef: p.externalRef ? String(p.externalRef) : null,
      },
    };
  }

  private normalizeStripe(
    eventType: string,
    payload: Record<string, unknown>,
  ): NormalizedInboundPaymentEvent {
    const p = payload as any;
    const object = p?.data?.object ?? {};
    const metadata = object?.metadata ?? {};

    return {
      source: 'stripe',
      eventType,
      payload,
      correlation: {
        internalPaymentId: metadata.paymentId
          ? String(metadata.paymentId)
          : null,
        merchantRef: metadata.merchantRef ? String(metadata.merchantRef) : null,
        externalRef: object.id ? String(object.id) : null,
      },
    };
  }

  private normalizePayos(
    eventType: string,
    payload: Record<string, unknown>,
  ): NormalizedInboundPaymentEvent {
    const p = payload as any;
    const data = p?.data ?? {};

    return {
      source: 'payos',
      eventType,
      payload,
      correlation: {
        internalPaymentId: data.paymentId ? String(data.paymentId) : null,
        merchantRef:
          data.orderCode !== undefined && data.orderCode !== null
            ? String(data.orderCode)
            : null,
        externalRef: data.paymentLinkId ? String(data.paymentLinkId) : null,
      },
    };
  }

  private normalizeMomo(
    eventType: string,
    payload: Record<string, unknown>,
  ): NormalizedInboundPaymentEvent {
    const p = payload as any;

    return {
      source: 'momo',
      eventType,
      payload,
      correlation: {
        internalPaymentId: p.paymentId ? String(p.paymentId) : null,
        merchantRef: p.orderId ? String(p.orderId) : null,
        externalRef:
          p.transId !== undefined && p.transId !== null
            ? String(p.transId)
            : null,
      },
    };
  }
}
