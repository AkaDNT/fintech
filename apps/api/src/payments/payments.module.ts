import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { StripePaymentProvider } from './providers/stripe-payment.provider';
import {
  MOMO_GATEWAY_CLIENT,
  MomoPaymentProvider,
} from './providers/momo-payment.provider';

@Module({
  controllers: [PaymentsController],
  providers: [
    PaymentsService,
    StripePaymentProvider,
    MomoPaymentProvider,
    {
      provide: MOMO_GATEWAY_CLIENT,
      useFactory: () => {
        return {
          async createOrder() {
            throw new Error(
              'MOMO_GATEWAY_CLIENT is not implemented yet. Wire your chosen MoMo client here.',
            );
          },
        };
      },
    },
    {
      provide: 'PAYMENT_PROVIDERS',
      useFactory: (
        stripe: StripePaymentProvider,
        momo: MomoPaymentProvider,
      ) => [stripe, momo],
      inject: [StripePaymentProvider, MomoPaymentProvider],
    },
  ],
})
export class PaymentsModule {}
