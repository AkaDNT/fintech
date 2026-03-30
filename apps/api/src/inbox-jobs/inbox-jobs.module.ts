import { Module } from '@nestjs/common';
import { InboxJobsService } from './inbox-jobs.service';
import { inboxQueueProvider, inboxRedisProvider } from './inbox.queue';

@Module({
  providers: [inboxRedisProvider, inboxQueueProvider, InboxJobsService],
  exports: [InboxJobsService],
})
export class InboxJobsModule {}
