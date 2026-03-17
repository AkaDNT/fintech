import { Injectable, Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ExpirePaymentHoldsHandler {
  readonly name = 'EXPIRE_PAYMENT_HOLDS';
  private readonly logger = new Logger(ExpirePaymentHoldsHandler.name);

  constructor(private readonly prisma: PrismaService) {}

  async handle(job: Job) {
    const now = new Date();

    const expiredHolds = await this.prisma.holdRecord.findMany({
      where: {
        status: 'ACTIVE',
        expiresAt: { lt: now },
      },
      include: {
        payment: {
          include: { wallet: true },
        },
      },
      take: 100,
    });

    let processed = 0;

    for (const hold of expiredHolds) {
      const updated = await this.prisma.$transaction(async (tx) => {
        const payment = hold.payment;
        const wallet = payment.wallet;

        if (payment.status !== 'HELD') {
          return false;
        }

        await tx.wallet.update({
          where: { id: wallet.id },
          data: {
            availableBalance: wallet.availableBalance + hold.amount,
            lockedBalance: wallet.lockedBalance - hold.amount,
          },
        });

        await tx.holdRecord.update({
          where: { id: hold.id },
          data: { status: 'EXPIRED' },
        });

        await tx.payment.update({
          where: { id: payment.id },
          data: { status: 'CANCELED' },
        });

        return true;
      });

      if (updated) {
        processed += 1;
      }
    }

    this.logger.log(
      JSON.stringify({
        msg: 'expire_payment_holds_done',
        processed,
      }),
    );

    return { processed };
  }
}
