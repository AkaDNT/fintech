import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAccessGuard } from 'src/auth/jwt-access.guard';
import { RolesGuard } from 'src/common/roles.guard';
import { Roles } from 'src/common/roles.decorator';
import { WebhookEndpointsService } from './webhook-endpoints.service';
import { CreateWebhookEndpointDto } from './dto/create-webhook-endpoint.dto';
import { WebhookEndpointQueryDto } from './dto/webhook-endpoint-query.dto';
import { RotateSecretDto } from './dto/rotate-secret.dto';

@Controller('admin/webhook-endpoints')
@UseGuards(JwtAccessGuard, RolesGuard)
@Roles('ADMIN')
export class WebhookEndpointsController {
  constructor(private readonly service: WebhookEndpointsService) {}

  @Post()
  create(@Body() dto: CreateWebhookEndpointDto) {
    return this.service.create(dto);
  }

  @Get()
  list(@Query() query: WebhookEndpointQueryDto) {
    return this.service.list(query);
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.service.getOne(id);
  }

  @Patch(':id/disable')
  disable(@Param('id') id: string) {
    return this.service.disable(id);
  }

  @Patch(':id/enable')
  enable(@Param('id') id: string) {
    return this.service.enable(id);
  }

  @Patch(':id/rotate-secret')
  rotateSecret(@Param('id') id: string, @Body() dto: RotateSecretDto) {
    return this.service.rotateSecret(id, dto);
  }
}
