import { Job } from 'bullmq';

export interface JobHandlerPort {
  readonly name: string;
  handle(job: Job): Promise<unknown>;
}
