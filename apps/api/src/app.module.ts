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
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_FILTER, useClass: GlobalExceptionFilter },
    { provide: APP_INTERCEPTOR, useClass: SuccessWrapInterceptor },
  ],
})
export class AppModule {}
