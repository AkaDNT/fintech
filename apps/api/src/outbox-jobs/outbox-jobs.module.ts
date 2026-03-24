import { Module } from '@nestjs/common';
import { OutboxJobsController } from './outbox-jobs.controller';
import { OutboxJobsService } from './outbox-jobs.service';
import { outboxQueueProvider, outboxRedisProvider } from './outbox.queue';

@Module({
  controllers: [OutboxJobsController],
  providers: [outboxRedisProvider, outboxQueueProvider, OutboxJobsService],
  exports: [OutboxJobsService],
})
export class OutboxJobsModule {}
