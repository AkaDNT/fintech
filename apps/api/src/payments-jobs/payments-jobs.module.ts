import { Module } from '@nestjs/common';
import { PaymentsJobsController } from './payments-jobs.controller';
import { PaymentsJobsService } from './payments-jobs.service';

@Module({
  controllers: [PaymentsJobsController],
  providers: [PaymentsJobsService],
  exports: [PaymentsJobsService],
})
export class PaymentsJobsModule {}
