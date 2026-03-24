import { Provider } from '@nestjs/common';
import { Queue } from 'bullmq';
import IORedis from 'ioredis';

export const OUTBOX_QUEUE = Symbol('OUTBOX_QUEUE');
export const OUTBOX_REDIS = Symbol('OUTBOX_REDIS');

export const outboxRedisProvider: Provider = {
  provide: OUTBOX_REDIS,
  useFactory: () => {
    return new IORedis(process.env.REDIS_URL!, {
      maxRetriesPerRequest: null,
    });
  },
};

export const outboxQueueProvider: Provider = {
  provide: OUTBOX_QUEUE,
  useFactory: (redis: IORedis) => {
    return new Queue('outbox', {
      connection: redis,
    });
  },
  inject: [OUTBOX_REDIS],
};
