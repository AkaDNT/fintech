import { Provider } from '@nestjs/common';
import { Queue } from 'bullmq';
import IORedis from 'ioredis';

export const REPORTS_QUEUE = Symbol('REPORTS_QUEUE');
export const REPORTS_REDIS = Symbol('REPORTS_REDIS');

export const reportsRedisProvider: Provider = {
  provide: REPORTS_REDIS,
  useFactory: () => {
    return new IORedis(process.env.REDIS_URL!, {
      maxRetriesPerRequest: null,
    });
  },
};

export const reportsQueueProvider: Provider = {
  provide: REPORTS_QUEUE,
  useFactory: (redis: IORedis) => {
    return new Queue('reports', {
      connection: redis,
    });
  },
  inject: [REPORTS_REDIS],
};
