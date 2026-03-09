import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { reportsQueueProvider, reportsRedisProvider } from './reports.queue';

@Module({
  controllers: [ReportsController],
  providers: [ReportsService, reportsQueueProvider, reportsRedisProvider],
})
export class ReportsModule {}
