import { Injectable, Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { Currency, EntryType } from '@repo/db';
import { getTraceId } from '@repo/shared';
import { JobHandler } from '../ports/job-handler.port';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ReconcileWalletsHandler implements JobHandler {
  readonly name = 'RECONCILE_WALLETS';
  private readonly logger = new Logger(ReconcileWalletsHandler.name);

  constructor(private readonly prisma: PrismaService) {}

  async handle(job: Job) {
    const currencyOrNull: Currency | null = job.data?.currency ?? null;
    const currencies: Currency[] = currencyOrNull
      ? [currencyOrNull]
      : [Currency.VND, Currency.USD];

    const summary: Array<{
      currency: Currency;
      walletsChecked: number;
      mismatches: number;
    }> = [];

    for (const currency of currencies) {
      const wallets = await this.prisma.wallet.findMany({
        where: { currency },
        select: {
          id: true,
          availableBalance: true,
          lockedBalance: true,
        },
      });

      const grouped = await this.prisma.ledgerEntry.groupBy({
        by: ['walletId', 'type'],
        where: { currency },
        _sum: {
          amount: true,
        },
      });

      const sums = new Map<string, { credit: bigint; debit: bigint }>();

      for (const row of grouped) {
        const amount = row._sum.amount ?? 0n;
        const current = sums.get(row.walletId) ?? { credit: 0n, debit: 0n };

        if (row.type === EntryType.CREDIT) current.credit += amount;
        if (row.type === EntryType.DEBIT) current.debit += amount;

        sums.set(row.walletId, current);
      }

      let mismatches = 0;

      for (const wallet of wallets) {
        const sum = sums.get(wallet.id) ?? { credit: 0n, debit: 0n };
        const ledgerBalance = sum.credit - sum.debit;
        const cachedBalance = wallet.availableBalance + wallet.lockedBalance;
        const delta = cachedBalance - ledgerBalance;

        if (delta !== 0n) {
          mismatches++;

          this.logger.warn(
            JSON.stringify({
              msg: 'reconcile_wallet_mismatch',
              traceId: getTraceId(),
              jobId: String(job.id),
              walletId: wallet.id,
              currency,
              cachedBalance: cachedBalance.toString(),
              ledgerBalance: ledgerBalance.toString(),
              delta: delta.toString(),
            }),
          );
        }
      }

      this.logger.log(
        JSON.stringify({
          msg: 'reconcile_currency_done',
          traceId: getTraceId(),
          jobId: String(job.id),
          currency,
          walletsChecked: wallets.length,
          mismatches,
        }),
      );

      summary.push({
        currency,
        walletsChecked: wallets.length,
        mismatches,
      });
    }

    return {
      ok: true,
      summary,
    };
  }
}
