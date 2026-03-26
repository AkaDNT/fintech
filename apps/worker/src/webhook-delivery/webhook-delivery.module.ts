import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { WebhookDeliveryWorker } from './webhook-delivery.worker';
import { DeliverWebhookHandler } from './handlers/deliver-webhook.handler';

@Module({
  imports: [PrismaModule],
  providers: [
    DeliverWebhookHandler,
    {
      provide: 'WEBHOOK_DELIVERY_JOB_HANDLERS',
      useFactory: (deliverWebhookHandler: DeliverWebhookHandler) => [
        deliverWebhookHandler,
      ],
      inject: [DeliverWebhookHandler],
    },
    WebhookDeliveryWorker,
  ],
})
export class WebhookDeliveryModule {}
