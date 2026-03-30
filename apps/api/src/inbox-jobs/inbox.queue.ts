import { Provider } from '@nestjs/common';
import { Queue } from 'bullmq';
import IORedis from 'ioredis';

export const INBOX_QUEUE = Symbol('INBOX_QUEUE');
export const INBOX_REDIS = Symbol('INBOX_REDIS');

export const inboxRedisProvider: Provider = {
  provide: INBOX_REDIS,
  useFactory: () => {
    return new IORedis(process.env.REDIS_URL!, {
      maxRetriesPerRequest: null,
    });
  },
};

export const inboxQueueProvider: Provider = {
  provide: INBOX_QUEUE,
  useFactory: (redis: IORedis) => {
    return new Queue('inbox', {
      connection: redis,
    });
  },
  inject: [INBOX_REDIS],
};
