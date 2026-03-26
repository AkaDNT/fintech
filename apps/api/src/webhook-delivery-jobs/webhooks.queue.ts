import { Provider } from '@nestjs/common';
import { Queue } from 'bullmq';
import IORedis from 'ioredis';

export const WEBHOOKS_QUEUE = Symbol('WEBHOOKS_QUEUE');
export const WEBHOOKS_REDIS = Symbol('WEBHOOKS_REDIS');

export const webhooksRedisProvider: Provider = {
  provide: WEBHOOKS_REDIS,
  useFactory: () => {
    return new IORedis(process.env.REDIS_URL!, {
      maxRetriesPerRequest: null,
    });
  },
};

export const webhooksQueueProvider: Provider = {
  provide: WEBHOOKS_QUEUE,
  useFactory: (redis: IORedis) => {
    return new Queue('webhooks', {
      connection: redis,
    });
  },
  inject: [WEBHOOKS_REDIS],
};
