import { Injectable } from '@nestjs/common';
import { PaymentQueryDto } from 'src/payments/dto/payment-query.dto';
import { PaymentErrors } from 'src/payments/errors/payment-error.factory';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AdminPaymentsService {
  constructor(private readonly prisma: PrismaService) {}
  async adminListPayments(query: PaymentQueryDto) {
    return this.prisma.payment.findMany({
      where: {
        ...(query.status ? { status: query.status } : {}),
        ...(query.currency ? { currency: query.currency } : {}),
        ...(query.merchantRef ? { merchantRef: query.merchantRef } : {}),
      },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        userId: true,
        walletId: true,
        currency: true,
        amount: true,
        status: true,
        merchantRef: true,
        externalRef: true,
        description: true,
        ledgerTxId: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async adminGetPayment(paymentId: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { id: paymentId },
      select: {
        id: true,
        userId: true,
        walletId: true,
        currency: true,
        amount: true,
        status: true,
        merchantRef: true,
        externalRef: true,
        description: true,
        ledgerTxId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!payment) {
      throw PaymentErrors.paymentNotFound();
    }

    return payment;
  }
}
