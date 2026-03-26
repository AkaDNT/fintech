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
export class WebhookDeliveryWorker implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(WebhookDeliveryWorker.name);
  private worker!: Worker;

  constructor(
    @Inject('WEBHOOK_DELIVERY_JOB_HANDLERS')
    private readonly handlers: JobHandler[],
  ) {}

  async onModuleInit() {
    const redis = new IORedis(process.env.REDIS_URL!, {
      maxRetriesPerRequest: null,
    });

    const handlerMap = new Map(this.handlers.map((h) => [h.name, h]));

    this.worker = new Worker(
      'webhooks',
      async (job: Job) => {
        const traceId = job.data?.traceId ?? 'unknown';

        return runWithTraceId(traceId, async () => {
          const handler = handlerMap.get(job.name);

          if (!handler) {
            this.logger.warn(
              JSON.stringify({
                msg: 'webhook_job_handler_missing',
                traceId: getTraceId(),
                jobId: String(job.id),
                jobName: job.name,
              }),
            );

            return { ok: false, reason: `No handler for ${job.name}` };
          }

          this.logger.log(
            JSON.stringify({
              msg: 'webhook_job_started',
              traceId: getTraceId(),
              jobId: String(job.id),
              jobName: job.name,
            }),
          );

          const result = await handler.handle(job);

          this.logger.log(
            JSON.stringify({
              msg: 'webhook_job_completed',
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
