import {
  Inject,
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { Worker, Job } from 'bullmq';
import IORedis from 'ioredis';
import { JobHandler } from './ports/job-handler.port';
import { runWithTraceId, getTraceId } from '@repo/shared';

@Injectable()
export class OutboxWorker implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(OutboxWorker.name);
  private worker!: Worker;

  constructor(
    @Inject('OUTBOX_JOB_HANDLERS')
    private readonly handlers: JobHandler[],
  ) {}

  async onModuleInit() {
    const redis = new IORedis(process.env.REDIS_URL!, {
      maxRetriesPerRequest: null,
    });

    this.worker = new Worker(
      'outbox',
      async (job: Job) => {
        const traceId = job.data?.traceId ?? 'unknown';

        return runWithTraceId(traceId, async () => {
          const handler = this.handlers.find((h) => h.name === job.name);

          if (!handler) {
            this.logger.warn(
              JSON.stringify({
                msg: 'outbox_job_handler_missing',
                traceId: getTraceId(),
                jobId: String(job.id),
                jobName: job.name,
              }),
            );

            return {
              ok: false,
              reason: `No handler for job ${job.name}`,
            };
          }

          this.logger.log(
            JSON.stringify({
              msg: 'outbox_job_started',
              traceId: getTraceId(),
              jobId: String(job.id),
              jobName: job.name,
            }),
          );

          const result = await handler.handle(job);

          this.logger.log(
            JSON.stringify({
              msg: 'outbox_job_completed',
              traceId: getTraceId(),
              jobId: String(job.id),
              jobName: job.name,
            }),
          );

          return result;
        });
      },
      {
        connection: redis,
      },
    );
  }

  async onModuleDestroy() {
    if (this.worker) {
      await this.worker.close();
    }
  }
}
