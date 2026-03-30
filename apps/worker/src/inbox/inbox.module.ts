import { Module } from '@nestjs/common';
import { ProcessInboxMessageHandler } from './handlers/process-inbox-message.handler';
import { PaymentCallbackDomainService } from './payment-callback-domain.service';
import { InboxWorker } from './inbox.worker';
import { PaymentCorrelationResolverService } from './payment-correlation-resolver.service';
import { PaymentWebhookNormalizer } from './payment-webhook.normalizer';

@Module({
  providers: [
    PaymentCallbackDomainService,
    ProcessInboxMessageHandler,
    InboxWorker,
    PaymentCorrelationResolverService,
    PaymentWebhookNormalizer,
  ],
})
export class InboxModule {}
