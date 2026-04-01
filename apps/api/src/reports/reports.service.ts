import { Injectable, HttpStatus, Inject } from '@nestjs/common';
import { REPORTS_QUEUE } from './reports.queue';
import { AppException } from 'src/common/errors/app.exception';
import { ERROR_CODES } from 'src/common/errors/error-codes';
import { Queue } from 'bullmq';
import { Currency } from '@repo/db';
import { UsersCsvQueryDto } from './dto/users-csv-query.dto';

@Injectable()
export class ReportsService {
  constructor(@Inject(REPORTS_QUEUE) private readonly reportsQueue: Queue) {}
  async enqueueUsersCsv(traceId: string, filter?: UsersCsvQueryDto) {
    const job = await this.reportsQueue.add(
      'USERS_CSV',
      {
        traceId,
        date: filter?.date || null,
        from: filter?.from || null,
        to: filter?.to || null,
      },
      {
        attempts: 5,
        backoff: { type: 'exponential', delay: 2000 },
        removeOnComplete: { count: 1000 },
        removeOnFail: { count: 5000 },
      },
    );

    return { jobId: job.id };
  }

  enqueueReconcile(traceId: string, currency?: Currency) {
    return this.reportsQueue.add(
      'RECONCILE_WALLETS',
      { traceId, currency: currency ?? null },
      {
        attempts: 5,
        backoff: { type: 'exponential', delay: 2000 },
        removeOnComplete: { count: 1000 },
        removeOnFail: { count: 5000 },
      },
    );
  }

  async getJobStatus(id: string) {
    const job = await this.reportsQueue.getJob(id);
    if (!job) {
      throw new AppException(
        { code: ERROR_CODES.JOB_NOT_FOUND, message: 'Job not found' },
        HttpStatus.NOT_FOUND,
      );
    }

    const state = await job.getState();
    return {
      id: String(job.id),
      name: job.name,
      state,
      progress: job.progress ?? 0,
      failedReason: job.failedReason ?? null,
      returnValue: (job as any).returnvalue ?? null,
      attemptsMade: job.attemptsMade,
    };
  }
}
