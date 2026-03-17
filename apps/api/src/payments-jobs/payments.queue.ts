import { Queue } from 'bullmq';
import IORedis from 'ioredis';

export const paymentsQueue = new Queue('payments', {
  connection: new IORedis(process.env.REDIS_URL!),
});
