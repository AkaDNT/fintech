import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAccessGuard } from 'src/auth/jwt-access.guard';
import { RolesGuard } from 'src/common/roles.guard';
import { Roles } from 'src/common/roles.decorator';
import { WebhookDeliveriesService } from './webhook-deliveries.service';
import { WebhookDeliveryQueryDto } from './dto/webhook-delivery-query.dto';
import { ReplayDeadDto } from './dto/replay-dead.dto';

@Controller('admin/webhook-deliveries')
@UseGuards(JwtAccessGuard, RolesGuard)
@Roles('ADMIN')
export class WebhookDeliveriesController {
  constructor(private readonly service: WebhookDeliveriesService) {}

  @Get()
  list(@Query() query: WebhookDeliveryQueryDto) {
    return this.service.list(query);
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.service.getOne(id);
  }

  @Post(':id/retry')
  retryOne(@Param('id') id: string) {
    return this.service.retryOne(id);
  }

  @Post('replay-dead')
  replayDead(@Body() dto: ReplayDeadDto) {
    return this.service.replayDead(dto);
  }
}
