export const PAYMENT_EVENTS = {
  HELD: 'payment.held',
  CAPTURED: 'payment.captured',
  CANCELED: 'payment.canceled',
  REFUNDED: 'payment.refunded',
} as const;

export type PaymentOutboxEventType =
  (typeof PAYMENT_EVENTS)[keyof typeof PAYMENT_EVENTS];

export async function createPaymentOutboxEvent(
  tx: any,
  params: {
    eventType: PaymentOutboxEventType;
    paymentId: string;
    userId: string;
    walletId: string;
    amount: bigint;
    currency: string;
    status: string;
    traceId?: string | null;
    extra?: Record<string, unknown>;
  },
) {
  return tx.outboxEvent.create({
    data: {
      aggregateType: 'payment',
      aggregateId: params.paymentId,
      eventType: params.eventType,
      payload: {
        paymentId: params.paymentId,
        userId: params.userId,
        walletId: params.walletId,
        amount: params.amount.toString(),
        currency: params.currency,
        status: params.status,
        traceId: params.traceId ?? null,
        ...params.extra,
      },
    },
    select: {
      id: true,
      eventType: true,
      createdAt: true,
    },
  });
}
