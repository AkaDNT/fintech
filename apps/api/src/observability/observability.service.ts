import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { MetricsService } from './metrics.service';

@Injectable()
export class ObservabilityService implements OnModuleInit {
  constructor(
    private readonly prisma: PrismaService,
    private readonly metrics: MetricsService,
  ) {}

  onModuleInit() {
    void this.refreshGauges();

    setInterval(() => {
      void this.refreshGauges();
    }, 10000);
  }

  async refreshGauges() {
    const [outboxPending, deliveries, inboxes] = await Promise.all([
      this.prisma.outboxEvent.count({
        where: { status: 'PENDING' },
      }),
      this.prisma.webhookDelivery.groupBy({
        by: ['status'],
        _count: { _all: true },
      }),
      this.prisma.inboxMessage.groupBy({
        by: ['status'],
        _count: { _all: true },
      }),
    ]);

    this.metrics.outboxPendingCount.set(outboxPending);

    for (const status of [
      'PENDING',
      'PROCESSING',
      'SUCCEEDED',
      'FAILED',
      'DEAD',
    ]) {
      this.metrics.webhookDeliveryCount.set(
        { status },
        deliveries.find((x) => x.status === status)?._count._all ?? 0,
      );
    }

    for (const status of ['RECEIVED', 'PROCESSING', 'PROCESSED', 'FAILED']) {
      this.metrics.inboxMessageCount.set(
        { status },
        inboxes.find((x) => x.status === status)?._count._all ?? 0,
      );
    }
  }
}
