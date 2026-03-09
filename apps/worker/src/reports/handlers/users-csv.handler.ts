import { Injectable } from '@nestjs/common';
import { Job } from 'bullmq';
import { JobHandler } from '../ports/job-handler.port';

@Injectable()
export class UsersCsvHandler implements JobHandler {
  readonly name = 'USERS_CSV';

  async handle(job: Job) {
    return {
      ok: true,
      jobId: String(job.id),
      note: 'Implement USERS_CSV export logic here',
    };
  }
}
