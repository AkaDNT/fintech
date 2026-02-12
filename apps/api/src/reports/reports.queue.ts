import { Queue } from 'bullmq';
import IORedis from 'ioredis';

export const reportsQueue = new Queue('reports', {
  connection: new IORedis(process.env.REDIS_URL!, {
    maxRetriesPerRequest: null,
  }),
});
