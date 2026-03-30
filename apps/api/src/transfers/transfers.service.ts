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
    toUserId: string;
    currency: Currency;
    amountStr: string;
  }) {
    const { idemKey, userId, toUserId, currency, amountStr } = params;
    const requestHash = `${userId}:${toUserId}:${currency}:${amountStr}`;

    // 1) Idempotency: If replayed, return the cached response without re-executing business logic
    const started = await this.idem.start(idemKey, 'TRANSFER', requestHash);
    if (started.replay) return started.response;

    // 2) Validate amount (numeric string -> bigint > 0)
    const amount = parseAmount(amountStr);

    // (Optional) Prevent self-transfers
    if (userId === toUserId) {
      throw new AppException(
        {
          code: ERROR_CODES.AMOUNT_INVALID,
          message: 'Cannot transfer to yourself',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const result = await this.prisma.$transaction(async (tx) => {
        // 3) Resolve wallets by (userId, currency) within the transaction
        const [from, to] = await Promise.all([
          tx.wallet.findUnique({
            where: { userId_currency: { userId, currency } },
          }),
          tx.wallet.findUnique({
            where: { userId_currency: { userId: toUserId, currency } },
          }),
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

        // (Optional safety) Ensure currency match (redundant if query is scoped by currency, but good for safety)
        if (from.currency !== currency || to.currency !== currency) {
          throw new AppException(
            {
              code: ERROR_CODES.CURRENCY_MISMATCH,
              message: 'Currency mismatch',
            },
            HttpStatus.BAD_REQUEST,
          );
        }

        // 4) Update balances atomically to avoid lost updates under concurrency.
        const debited = await tx.wallet.updateMany({
          where: {
            id: from.id,
            status: WalletStatus.ACTIVE,
            currency,
            availableBalance: { gte: amount },
          },
          data: {
            availableBalance: { decrement: amount },
          },
        });

        if (debited.count !== 1) {
          throw new AppException(
            {
              code: ERROR_CODES.INSUFFICIENT_FUNDS,
              message: 'Insufficient funds',
            },
            HttpStatus.BAD_REQUEST,
          );
        }

        const credited = await tx.wallet.updateMany({
          where: {
            id: to.id,
            status: WalletStatus.ACTIVE,
            currency,
          },
          data: {
            availableBalance: { increment: amount },
          },
        });

        if (credited.count !== 1) {
          throw new AppException(
            {
              code: ERROR_CODES.WALLET_DISABLED,
              message: 'Wallet is disabled',
            },
            HttpStatus.FORBIDDEN,
          );
        }

        // 5) Create ledger transaction + 2 entries (double-entry accounting)
        const ledgerTx = await tx.ledgerTransaction.create({
          data: {
            kind: TxKind.TRANSFER,
            status: TxStatus.SUCCEEDED,
            currency,
            amount,
            reference: idemKey, // Useful for tracing and replay lookups
            createdBy: userId,
            entries: {
              create: [
                {
                  walletId: from.id,
                  type: EntryType.DEBIT,
                  amount,
                  currency,
                },
                {
                  walletId: to.id,
                  type: EntryType.CREDIT,
                  amount,
                  currency,
                },
              ],
            },
          },
          select: { id: true, createdAt: true },
        });

        // 6) Prepare response (Convert BigInt to string for JSON compatibility)
        return {
          transferTxId: ledgerTx.id,
          fromWalletId: from.id,
          toWalletId: to.id,
          currency,
          amount: amount.toString(),
          createdAt: ledgerTx.createdAt.toISOString(),
        };
      });

      // 7) Mark idempotency as succeeded and store response for future replays
      await this.idem.succeed(idemKey, result);
      return result;
    } catch (e) {
      // 8) Mark as failed (Policy: This key cannot be reused for a new attempt)
      await this.idem.fail(idemKey);
      throw e;
    }
  }
}
