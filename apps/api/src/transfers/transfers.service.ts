import { Injectable, HttpStatus } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AppException } from 'src/common/errors/app.exception';
import { ERROR_CODES } from 'src/common/errors/error-codes';
import { parseAmount } from 'src/common/money/amount';
import { IdempotencyService } from 'src/common/idempotency/idempotency.service';
import { Currency, EntryType, TxKind, TxStatus, WalletStatus } from '@repo/db';

@Injectable()
export class TransfersService {
  constructor(
    private prisma: PrismaService,
    private idem: IdempotencyService,
  ) {}

  async createTransfer(params: {
    idemKey: string;
    userId: string;
    toWalletId: string;
    currency: Currency;
    amountStr: string;
  }) {
    const { idemKey, userId, toWalletId, currency, amountStr } = params;
    const currentWallet = await this.prisma.wallet.findUnique({
      where: {
        userId_currency: { userId, currency },
      },
    });
    const fromWalletId = currentWallet?.id;
    const scope = 'TRANSFER';

    const started = await this.idem.start(idemKey, scope);
    if (started.replay) return started.response;

    const amount = parseAmount(amountStr);

    try {
      const result = await this.prisma.$transaction(async (tx) => {
        const [from, to] = await Promise.all([
          tx.wallet.findUnique({ where: { id: fromWalletId } }),
          tx.wallet.findUnique({ where: { id: toWalletId } }),
        ]);

        if (!from || !to) {
          throw new AppException(
            { code: ERROR_CODES.WALLET_NOT_FOUND, message: 'Wallet not found' },
            HttpStatus.NOT_FOUND,
          );
        }

        if (
          from.status !== WalletStatus.ACTIVE ||
          to.status !== WalletStatus.ACTIVE
        ) {
          throw new AppException(
            {
              code: ERROR_CODES.WALLET_DISABLED,
              message: 'Wallet is disabled',
            },
            HttpStatus.FORBIDDEN,
          );
        }

        if (from.currency !== currency || to.currency !== currency) {
          throw new AppException(
            {
              code: ERROR_CODES.CURRENCY_MISMATCH,
              message: 'Currency mismatch',
            },
            HttpStatus.BAD_REQUEST,
          );
        }

        if (from.availableBalance < amount) {
          throw new AppException(
            {
              code: ERROR_CODES.INSUFFICIENT_FUNDS,
              message: 'Insufficient funds',
            },
            HttpStatus.BAD_REQUEST,
          );
        }

        // update balances
        await tx.wallet.update({
          where: { id: from.id },
          data: { availableBalance: from.availableBalance - amount },
        });
        await tx.wallet.update({
          where: { id: to.id },
          data: { availableBalance: to.availableBalance + amount },
        });

        // ledger transaction + entries
        const ledgerTx = await tx.ledgerTransaction.create({
          data: {
            kind: TxKind.TRANSFER,
            status: TxStatus.SUCCEEDED,
            currency,
            amount,
            reference: idemKey,
            createdBy: userId,
            entries: {
              create: [
                { walletId: from.id, type: EntryType.DEBIT, amount, currency },
                { walletId: to.id, type: EntryType.CREDIT, amount, currency },
              ],
            },
          },
          select: { id: true, createdAt: true },
        });

        return {
          transferTxId: ledgerTx.id,
          fromWalletId: from.id,
          toWalletId: to.id,
          currency,
          amount: amount.toString(),
          createdAt: ledgerTx.createdAt.toISOString(),
        };
      });

      await this.idem.succeed(idemKey, result);
      return result;
    } catch (e) {
      await this.idem.fail(idemKey);
      throw e;
    }
  }
}
