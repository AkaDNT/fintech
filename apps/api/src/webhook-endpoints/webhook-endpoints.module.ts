import { Module } from '@nestjs/common';
import { WebhookEndpointsService } from './webhook-endpoints.service';
import { WebhookEndpointsController } from './webhook-endpoints.controller';

@Module({
  controllers: [WebhookEndpointsController],
  providers: [WebhookEndpointsService],
})
export class WebhookEndpointsModule {}
