import { Injectable } from '@nestjs/common';
import { paymentsQueue } from './payments.queue';

@Injectable()
export class PaymentsJobsService {
  async enqueueExpireHolds(traceId: string) {
    const job = await paymentsQueue.add(
      'EXPIRE_PAYMENT_HOLDS',
      { traceId },
      {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 1000,
        },
        removeOnComplete: { count: 500 },
        removeOnFail: { count: 2000 },
      },
    );

    return { jobId: String(job.id), jobName: job.name };
  }
}
