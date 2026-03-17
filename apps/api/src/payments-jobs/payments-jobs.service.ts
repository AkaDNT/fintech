import { Injectable } from '@nestjs/common';
import { paymentsQueue } from './payments.queue';

@Injectable()
export class PaymentsJobsService {
  async enqueueExpireHolds() {
    const job = await paymentsQueue.add(
      'EXPIRE_PAYMENT_HOLDS',
      {},
      {
        removeOnComplete: { count: 500 },
        removeOnFail: { count: 2000 },
      },
    );

    return { jobId: String(job.id), jobName: job.name };
  }
}
