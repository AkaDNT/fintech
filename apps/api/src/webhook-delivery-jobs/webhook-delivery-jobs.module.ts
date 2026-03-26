import { Module } from '@nestjs/common';
import { WebhookDeliveryJobsController } from './webhook-delivery-jobs.controller';
import { WebhookDeliveryJobsService } from './webhook-delivery-jobs.service';
import { webhooksQueueProvider, webhooksRedisProvider } from './webhooks.queue';

@Module({
  controllers: [WebhookDeliveryJobsController],
  providers: [
    WebhookDeliveryJobsService,
    webhooksRedisProvider,
    webhooksQueueProvider,
  ],
})
export class ReportsModule {}
