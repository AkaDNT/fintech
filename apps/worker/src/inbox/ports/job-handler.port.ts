import { Job } from 'bullmq';

export interface JobHandler {
  readonly name: string;
  handle(job: Job): Promise<unknown>;
}
