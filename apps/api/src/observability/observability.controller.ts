import { Controller, Get, Header, UseGuards } from '@nestjs/common';
import { MetricsService } from './metrics.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtAccessGuard } from 'src/auth/jwt-access.guard';
import { RolesGuard } from 'src/common/roles.guard';
import { Roles } from 'src/common/roles.decorator';

@Controller()
export class ObservabilityController {
  constructor(
    private readonly metrics: MetricsService,
    private readonly prisma: PrismaService,
  ) {}

  @Get('internal/observability/metrics')
  @Header('Content-Type', 'text/plain; version=0.0.4')
  async metricsText() {
    return this.metrics.getMetricsText();
  }

  @Get('admin/observability/summary')
  @UseGuards(JwtAccessGuard, RolesGuard)
  @Roles('ADMIN')
  async summary() {
    const [outboxPending, deliveryFailed, deliveryDead, inboxFailed] =
      await Promise.all([
        this.prisma.outboxEvent.count({ where: { status: 'PENDING' } }),
        this.prisma.webhookDelivery.count({ where: { status: 'FAILED' } }),
        this.prisma.webhookDelivery.count({ where: { status: 'DEAD' } }),
        this.prisma.inboxMessage.count({ where: { status: 'FAILED' } }),
      ]);

    return {
      outbox: { pending: outboxPending },
      delivery: { failed: deliveryFailed, dead: deliveryDead },
      inbox: { failed: inboxFailed },
      generatedAt: new Date().toISOString(),
    };
  }
}
