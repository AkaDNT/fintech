import { Injectable, HttpStatus } from '@nestjs/common';
import { reportsQueue } from './reports.queue';
import { AppException } from 'src/common/errors/app.exception';
import { ERROR_CODES } from 'src/common/errors/error-codes';
import { getTraceId } from '@repo/shared';

@Injectable()
export class ReportsService {
  async enqueueUsersCsv(date?: string | null) {
    const traceId = getTraceId();
    const job = await reportsQueue.add(
      'USERS_CSV',
      { date: date || null, traceId },
      {
        attempts: 5,
        backoff: { type: 'exponential', delay: 2000 },
        removeOnComplete: { count: 1000 },
        removeOnFail: { count: 5000 },
      },
    );

    return { jobId: job.id };
  }

  async getJobStatus(id: string) {
    const job = await reportsQueue.getJob(id);
    if (!job) {
      throw new AppException(
        { code: ERROR_CODES.JOB_NOT_FOUND, message: 'Job not found' },
        HttpStatus.NOT_FOUND,
      );
    }

    const state = await job.getState();
    return {
      state,
      jobProgress: job.progress,
      failedReason: job.failedReason || null,
      returnValue: job.returnvalue || null,
    };
  }
}
