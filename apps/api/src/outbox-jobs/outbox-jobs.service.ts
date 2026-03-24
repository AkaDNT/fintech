import { HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bullmq';
import { OUTBOX_QUEUE } from './outbox.queue';
import { AppException } from 'src/common/errors/app.exception';
import { ERROR_CODES } from 'src/common/errors/error-codes';

@Injectable()
export class OutboxJobsService {
  private readonly logger = new Logger(OutboxJobsService.name);

  constructor(@Inject(OUTBOX_QUEUE) private readonly queue: Queue) {}

  async enqueuePublish(traceId: string) {
    try {
      const job = await this.queue.add(
        'PUBLISH_OUTBOX_EVENTS',
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
          msg: 'outbox_publish_enqueued',
          traceId,
          jobId: String(job.id),
          jobName: job.name,
        }),
      );

      return { jobId: job.id };
    } catch (error) {
      throw new AppException(
        {
          code: ERROR_CODES.JOB_FAILED,
          message: 'Failed to enqueue outbox publish job',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
