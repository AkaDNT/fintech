import { Module } from '@nestjs/common';
import { ReportsWorker } from './reports.worker';
import { ReconcileWalletsHandler } from './handlers/reconcile-wallets.handler';
import { UsersCsvHandler } from './handlers/users-csv.handler';

@Module({
  providers: [
    ReconcileWalletsHandler,
    UsersCsvHandler,
    {
      provide: 'REPORTS_JOB_HANDLERS',
      useFactory: (
        reconcileWalletsHandler: ReconcileWalletsHandler,
        usersCsvHandler: UsersCsvHandler,
      ) => [reconcileWalletsHandler, usersCsvHandler],
      inject: [ReconcileWalletsHandler, UsersCsvHandler],
    },
    ReportsWorker,
  ],
})
export class ReportsModule {}
