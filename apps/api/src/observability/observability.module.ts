import { Module } from '@nestjs/common';
import { ObservabilityController } from './observability.controller';
import { ObservabilityService } from './observability.service';
import { MetricsService } from './metrics.service';

@Module({
  controllers: [ObservabilityController],
  providers: [ObservabilityService, MetricsService],
  exports: [MetricsService, ObservabilityService],
})
export class ObservabilityModule {}
