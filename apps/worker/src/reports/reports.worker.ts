import {
  Inject,
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { Worker } from 'bullmq';
import IORedis from 'ioredis';
import { getTraceId, runWithTraceId } from '@repo/shared';
import { JobHandler } from './ports/job-handler.port';

@Injectable()
export class ReportsWorker implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(ReportsWorker.name);
  private worker!: Worker;
  private redis?: IORedis;

  constructor(
    @Inject('REPORTS_JOB_HANDLERS')
    private readonly handlers: JobHandler[],
  ) {}

  async onModuleInit() {
    this.redis = new IORedis(process.env.REDIS_URL!, {
      maxRetriesPerRequest: null,
    });

    const handlerMap = new Map(
      this.handlers.map((handler) => [handler.name, handler]),
    );

    this.worker = new Worker(
      'reports',
      async (job) => {
        const traceId = job.data?.traceId ?? 'unknown';

        return runWithTraceId(traceId, async () => {
          this.logger.log(
            JSON.stringify({
              msg: 'reports_job_started',
              traceId: getTraceId(),
              jobId: String(job.id),
              jobName: job.name,
            }),
          );

          const handler = handlerMap.get(job.name);

          if (!handler) {
            const error = new Error(`No handler for job ${job.name}`);

            this.logger.error(
              JSON.stringify({
                msg: 'reports_job_handler_missing',
                traceId: getTraceId(),
                jobId: String(job.id),
                jobName: job.name,
              }),
            );

            throw error;
          }

          let result: unknown;
          try {
            result = await handler.handle(job);
          } catch (error) {
            this.logger.error(
              JSON.stringify({
                msg: 'reports_job_failed',
                traceId: getTraceId(),
                jobId: String(job.id),
                jobName: job.name,
                error: error instanceof Error ? error.message : String(error),
              }),
            );
            throw error;
          }

          this.logger.log(
            JSON.stringify({
              msg: 'reports_job_completed',
              traceId: getTraceId(),
              jobId: String(job.id),
              jobName: job.name,
            }),
          );

          return result;
        });
      },
      {
        connection: this.redis,
      },
    );
  }

  async onModuleDestroy() {
    if (this.worker) {
      await this.worker.close();
    }

    if (this.redis) {
      await this.redis.quit();
      this.redis = undefined;
    }
  }
}
