import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PaymentsWorker } from './payments.worker';
import { ExpirePaymentHoldsHandler } from './handlers/expire-payment-holds.handler';

@Module({
  imports: [PrismaModule],
  providers: [
    ExpirePaymentHoldsHandler,
    {
      provide: 'PAYMENTS_JOB_HANDLERS',
      useFactory: (expirePaymentHoldsHandler: ExpirePaymentHoldsHandler) => [
        expirePaymentHoldsHandler,
      ],
      inject: [ExpirePaymentHoldsHandler],
    },
    PaymentsWorker,
  ],
})
export class PaymentsModule {}
