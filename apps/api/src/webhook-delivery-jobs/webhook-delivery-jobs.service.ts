import { Inject, Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bullmq';
import { WEBHOOKS_QUEUE } from './webhooks.queue';

@Injectable()
export class WebhookDeliveryJobsService {
  private readonly logger = new Logger(WebhookDeliveryJobsService.name);

  constructor(@Inject(WEBHOOKS_QUEUE) private readonly queue: Queue) {}

  async enqueueDeliver(traceId: string) {
    const job = await this.queue.add(
      'DELIVER_WEBHOOK',
      { traceId },
      {
        attempts: 5,
        backoff: { type: 'exponential', delay: 2000 },
        removeOnComplete: { count: 1000 },
        removeOnFail: { count: 5000 },
      },
    );

    this.logger.log(
      JSON.stringify({
        msg: 'webhook_delivery_enqueued',
        traceId,
        jobId: String(job.id),
        jobName: job.name,
      }),
    );

    return { jobId: String(job.id) };
  }
}
