import { Module } from '@nestjs/common';
import { InboxWebhooksController } from './inbox-webhooks.controller';
import { InboxWebhooksService } from './inbox-webhooks.service';
import { InboxJobsModule } from 'src/inbox-jobs/inbox-jobs.module';
import { MockProviderVerifier } from './providers/mock-provider.verifier';
import { StripeProviderVerifier } from './providers/stripe-provider.verifier';
import { PayosProviderVerifier } from './providers/payos-provider.verifier';
import { MomoProviderVerifier } from './providers/momo-provider.verifier';

@Module({
  imports: [InboxJobsModule],
  controllers: [InboxWebhooksController],
  providers: [
    InboxWebhooksService,
    MockProviderVerifier,
    StripeProviderVerifier,
    PayosProviderVerifier,
    MomoProviderVerifier,
    {
      provide: 'INBOUND_WEBHOOK_VERIFIERS',
      useFactory: (
        mock: MockProviderVerifier,
        stripe: StripeProviderVerifier,
        payos: PayosProviderVerifier,
        momo: MomoProviderVerifier,
      ) => [mock, stripe, payos, momo],
      inject: [
        MockProviderVerifier,
        StripeProviderVerifier,
        PayosProviderVerifier,
        MomoProviderVerifier,
      ],
    },
  ],
  exports: [InboxWebhooksService],
})
export class InboxWebhooksModule {}
