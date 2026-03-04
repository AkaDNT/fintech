import { Module } from '@nestjs/common';
import { TransfersService } from './transfers.service';
import { TransfersController } from './transfers.controller';
import { IdempotencyService } from 'src/common/idempotency/idempotency.service';

@Module({
  controllers: [TransfersController],
  providers: [TransfersService, IdempotencyService],
})
export class TransfersModule {}
