import { Module } from '@nestjs/common';
import { WebhookDeliveriesController } from './webhook-deliveries.controller';
import { WebhookDeliveriesService } from './webhook-deliveries.service';

@Module({
  controllers: [WebhookDeliveriesController],
  providers: [WebhookDeliveriesService],
  exports: [WebhookDeliveriesService],
})
export class WebhookDeliveriesModule {}
