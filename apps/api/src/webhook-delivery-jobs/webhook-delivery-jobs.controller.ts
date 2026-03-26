import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAccessGuard } from 'src/auth/jwt-access.guard';
import { Roles } from 'src/common/roles.decorator';
import { RolesGuard } from 'src/common/roles.guard';
import { WebhookDeliveryJobsService } from './webhook-delivery-jobs.service';

@Controller('admin/webhook-deliveries')
@UseGuards(JwtAccessGuard, RolesGuard)
@Roles('ADMIN')
export class WebhookDeliveryJobsController {
  constructor(private readonly webhookDelivery: WebhookDeliveryJobsService) {}

  @Post('run')
  enqueueWebhookDelivery(@Req() req: any) {
    return this.webhookDelivery.enqueueDeliver(req.traceId);
  }
}
