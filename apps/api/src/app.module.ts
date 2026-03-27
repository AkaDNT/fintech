import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import * as path from 'path';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ReportsModule } from './reports/reports.module';
import { LoggerModule } from 'nestjs-pino';
import { getTraceId } from '@repo/shared';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { SuccessWrapInterceptor } from './common/interceptors/success-wrap.interceptor';
import { WalletsModule } from './wallets/wallets.module';
import { TransfersModule } from './transfers/transfers.module';
import { AdminWalletsModule } from './admin-wallets/admin-wallets.module';
import { LedgerModule } from './ledger/ledger.module';
import { PaymentsModule } from './payments/payments.module';
import { PaymentsJobsModule } from './payments-jobs/payments-jobs.module';
import { AdminPaymentsModule } from './admin-payments/admin-payments.module';
import { OutboxJobsModule } from './outbox-jobs/outbox-jobs.module';
import { WebhookEndpointsModule } from './webhook-endpoints/webhook-endpoints.module';
import { WebhookDeliveriesModule } from './webhook-deliveries/webhook-deliveries.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: path.join(__dirname, '..', '.env'),
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        // JSON structured
        level: process.env.LOG_LEVEL || 'info',
        // Automatically add traceId to all log lines
        customProps: () => ({
          traceId: getTraceId(),
        }),

        // Redact sensitive fields
        redact: {
          paths: ['req.headers.authorization', 'req.headers.cookie'],
          remove: true,
        },

        // Reformat key
        // messageKey: "message",
      },
    }),
    PrismaModule,
    AuthModule,
    ReportsModule,
    WalletsModule,
    TransfersModule,
    AdminWalletsModule,
    LedgerModule,
    PaymentsModule,
    PaymentsJobsModule,
    AdminPaymentsModule,
    OutboxJobsModule,
    WebhookEndpointsModule,
    WebhookDeliveriesModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_FILTER, useClass: GlobalExceptionFilter },
    { provide: APP_INTERCEPTOR, useClass: SuccessWrapInterceptor },
  ],
})
export class AppModule {}
