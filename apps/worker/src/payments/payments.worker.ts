import {
  Inject,
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { Worker, Job } from 'bullmq';
import IORedis from 'ioredis';

@Injectable()
export class PaymentsWorker implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PaymentsWorker.name);
  private worker?: Worker;

  constructor(
    @Inject('PAYMENTS_JOB_HANDLERS')
    private readonly handlers: Array<{
      name: string;
      handle(job: Job): Promise<unknown>;
    }>,
  ) {}

  async onModuleInit() {
    const redis = new IORedis(process.env.REDIS_URL!, {
      maxRetriesPerRequest: null,
    });

    this.worker = new Worker(
      'payments',
      async (job) => {
        const handler = this.handlers.find((h) => h.name === job.name);

        if (!handler) {
          this.logger.warn(
            JSON.stringify({
              msg: 'payments_job_handler_missing',
              jobName: job.name,
              jobId: String(job.id),
            }),
          );
          return { ok: false, reason: `No handler for job ${job.name}` };
        }

        return handler.handle(job);
      },
      { connection: redis },
    );
  }

  async onModuleDestroy() {
    if (this.worker) {
      await this.worker.close();
    }
  }
}
