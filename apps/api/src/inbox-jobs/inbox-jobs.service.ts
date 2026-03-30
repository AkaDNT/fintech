import { Inject, Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { INBOX_QUEUE } from './inbox.queue';

@Injectable()
export class InboxJobsService {
  constructor(@Inject(INBOX_QUEUE) private readonly queue: Queue) {}

  async enqueueProcessInbox(params: {
    inboxMessageId: string;
    traceId: string;
  }) {
    const job = await this.queue.add(
      'PROCESS_INBOX_MESSAGE',
      {
        inboxMessageId: params.inboxMessageId,
        traceId: params.traceId,
      },
      {
        attempts: 5,
        backoff: { type: 'exponential', delay: 2000 },
        removeOnComplete: { count: 1000 },
        removeOnFail: { count: 5000 },
      },
    );

    return { jobId: String(job.id) };
  }
}
