import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { ReportsModule } from './reports/reports.module';
import { PaymentsModule } from './payments/payments.module';
import { OutboxModule } from './outbox/outbox.module';
import { WebhookDeliveryModule } from './webhook-delivery/webhook-delivery.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    ReportsModule,
    PaymentsModule,
    OutboxModule,
    WebhookDeliveryModule,
  ],
  providers: [],
})
export class AppModule {}
