import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

import { PaymentCorrelationCandidates } from './payment-webhook.types';
import { DomainError, ERROR_CODES } from '@repo/shared';

@Injectable()
export class PaymentCorrelationResolverService {
  constructor(private readonly prisma: PrismaService) {}

  async resolve(candidates: PaymentCorrelationCandidates): Promise<string> {
    if (candidates.internalPaymentId) {
      const payment = await this.prisma.payment.findUnique({
        where: { id: candidates.internalPaymentId },
        select: { id: true },
      });

      if (payment) return payment.id;
    }

    if (candidates.externalRef) {
      const payment = await this.prisma.payment.findFirst({
        where: { externalRef: candidates.externalRef },
        select: { id: true },
        orderBy: { createdAt: 'desc' },
      });

      if (payment) return payment.id;
    }

    if (candidates.merchantRef) {
      const payment = await this.prisma.payment.findFirst({
        where: { merchantRef: candidates.merchantRef },
        select: { id: true },
        orderBy: { createdAt: 'desc' },
      });

      if (payment) return payment.id;
    }

    throw new DomainError(
      ERROR_CODES.PAYMENT_CORRELATION_NOT_FOUND,
      'Cannot resolve payment from inbound webhook',
      candidates,
    );
  }
}
