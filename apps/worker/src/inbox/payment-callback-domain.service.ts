import { Injectable } from '@nestjs/common';
import { DomainError, ERROR_CODES } from '@repo/shared';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PaymentCallbackDomainService {
  constructor(private readonly prisma: PrismaService) {}

  async consume(params: {
    paymentId: string;
    source: string;
    eventType: string;
    payload: Record<string, unknown>;
    traceId: string;
  }) {
    switch (params.eventType) {
      case 'payment.succeeded':
        return this.markSucceeded(params.paymentId);

      case 'payment.failed':
        return this.markFailed(params.paymentId);

      case 'payment.canceled':
        return this.markCanceled(params.paymentId);

      case 'payment.refunded':
        return this.markRefunded(params.paymentId);

      default:
        return { ok: true, ignored: true };
    }
  }

  private async markSucceeded(paymentId: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { id: paymentId },
      select: {
        id: true,
        status: true,
      },
    });

    if (!payment) {
      throw new DomainError(
        ERROR_CODES.PAYMENT_NOT_FOUND,
        `Payment not found: ${paymentId}`,
      );
    }

    if (payment.status === 'CAPTURED') {
      return { ok: true, idempotent: true };
    }

    if (!['CREATED', 'HELD', 'PENDING'].includes(payment.status)) {
      throw new DomainError(
        ERROR_CODES.PAYMENT_INVALID_STATE,
        `Cannot mark payment succeeded from status ${payment.status}`,
        {
          paymentId,
          currentStatus: payment.status,
        },
      );
    }

    await this.prisma.payment.update({
      where: { id: paymentId },
      data: { status: 'CAPTURED' },
    });

    return { ok: true };
  }

  private async markFailed(paymentId: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { id: paymentId },
      select: {
        id: true,
        status: true,
      },
    });

    if (!payment) {
      throw new DomainError(
        ERROR_CODES.PAYMENT_NOT_FOUND,
        `Payment not found: ${paymentId}`,
      );
    }

    if (payment.status === 'FAILED' || payment.status === 'CANCELED') {
      return { ok: true, idempotent: true };
    }

    if (['CAPTURED', 'REFUNDED'].includes(payment.status)) {
      return { ok: true, ignored: true };
    }

    await this.prisma.payment.update({
      where: { id: paymentId },
      data: { status: 'FAILED' },
    });

    return { ok: true };
  }

  private async markCanceled(paymentId: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { id: paymentId },
      select: {
        id: true,
        status: true,
      },
    });

    if (!payment) {
      throw new DomainError(
        ERROR_CODES.PAYMENT_NOT_FOUND,
        `Payment not found: ${paymentId}`,
      );
    }

    if (payment.status === 'CANCELED') {
      return { ok: true, idempotent: true };
    }

    if (['CAPTURED', 'REFUNDED'].includes(payment.status)) {
      return { ok: true, ignored: true };
    }

    await this.prisma.payment.update({
      where: { id: paymentId },
      data: { status: 'CANCELED' },
    });

    return { ok: true };
  }

  private async markRefunded(paymentId: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { id: paymentId },
      select: {
        id: true,
        status: true,
      },
    });

    if (!payment) {
      throw new DomainError(
        ERROR_CODES.PAYMENT_NOT_FOUND,
        `Payment not found: ${paymentId}`,
      );
    }

    if (payment.status === 'REFUNDED') {
      return { ok: true, idempotent: true };
    }

    if (payment.status !== 'CAPTURED') {
      throw new DomainError(
        ERROR_CODES.PAYMENT_INVALID_STATE,
        `Cannot refund payment from status ${payment.status}`,
        {
          paymentId,
          currentStatus: payment.status,
        },
      );
    }

    await this.prisma.payment.update({
      where: { id: paymentId },
      data: { status: 'REFUNDED' },
    });

    return { ok: true };
  }
}
