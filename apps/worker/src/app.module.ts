import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ReportsWorker } from './reports/reports.worker';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  providers: [ReportsWorker],
})
export class AppModule {}
