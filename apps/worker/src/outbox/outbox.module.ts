import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { OutboxWorker } from './outbox.worker';
import { PublishOutboxEventsHandler } from './handlers/publish-outbox-events.handler';

@Module({
  imports: [PrismaModule],
  providers: [
    PublishOutboxEventsHandler,
    {
      provide: 'OUTBOX_JOB_HANDLERS',
      useFactory: (publishOutboxEventsHandler: PublishOutboxEventsHandler) => [
        publishOutboxEventsHandler,
      ],
      inject: [PublishOutboxEventsHandler],
    },
    OutboxWorker,
  ],
})
export class OutboxModule {}
