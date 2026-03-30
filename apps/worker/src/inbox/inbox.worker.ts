import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Worker, Job } from 'bullmq';
import IORedis from 'ioredis';
import { ProcessInboxMessageHandler } from './handlers/process-inbox-message.handler';

@Injectable()
export class InboxWorker implements OnModuleInit {
  private readonly logger = new Logger(InboxWorker.name);

  constructor(
    private readonly processInboxMessageHandler: ProcessInboxMessageHandler,
  ) {}

  async onModuleInit() {
    const redis = new IORedis(process.env.REDIS_URL!, {
      maxRetriesPerRequest: null,
    });

    const worker = new Worker(
      'inbox',
      async (job: Job) => {
        if (job.name === this.processInboxMessageHandler.name) {
          return this.processInboxMessageHandler.handle(job);
        }

        this.logger.warn(
          JSON.stringify({
            msg: 'unknown_inbox_job',
            jobName: job.name,
            jobId: String(job.id),
          }),
        );

        return null;
      },
      {
        connection: redis,
      },
    );

    worker.on('ready', () => {
      this.logger.log('Inbox worker ready');
    });

    worker.on('failed', (job, error) => {
      this.logger.error(
        JSON.stringify({
          msg: 'inbox_job_failed',
          jobName: job?.name,
          jobId: String(job?.id),
          error: error.message,
        }),
      );
    });
  }
}
