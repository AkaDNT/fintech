import { Injectable, HttpStatus } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AppException } from 'src/common/errors/app.exception';
import { ERROR_CODES } from 'src/common/errors/error-codes';

@Injectable()
export class LedgerService {
  constructor(private prisma: PrismaService) {}

  async getWalletLedger(params: {
    walletId: string;
    limit: number;
    cursor?: { createdAt: string; id: string }; // ISO string + id
  }) {
    const { walletId, limit, cursor } = params;

    const txs = await this.prisma.ledgerTransaction.findMany({
      where: {
        entries: { some: { walletId } },
      },
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      take: limit + 1,
      ...(cursor
        ? {
            cursor: {
              createdAt_id: {
                createdAt: new Date(cursor.createdAt),
                id: cursor.id,
              },
            },
            skip: 1,
          }
        : {}),
      select: {
        id: true,
        kind: true,
        status: true,
        currency: true,
        amount: true,
        reference: true,
        createdBy: true,
        createdAt: true,
        entries: {
          where: { walletId },
          select: {
            id: true,
            walletId: true,
            type: true,
            amount: true,
            currency: true,
            createdAt: true,
          },
        },
      },
    });

    let nextCursor: { createdAt: string; id: string } | null = null;
    let items = txs;

    if (txs.length > limit) {
      items = txs.slice(0, limit);

      const last = items[items.length - 1];
      nextCursor = {
        createdAt: last.createdAt.toISOString(),
        id: last.id,
      };
    }

    return { items, nextCursor };
  }

  // Admin: get 1 transaction detail (all entries)
  async getTransactionDetail(txId: string) {
    const tx = await this.prisma.ledgerTransaction.findUnique({
      where: { id: txId },
      select: {
        id: true,
        kind: true,
        status: true,
        currency: true,
        amount: true,
        reference: true,
        createdBy: true,
        createdAt: true,
        entries: {
          select: {
            id: true,
            walletId: true,
            type: true,
            amount: true,
            currency: true,
            createdAt: true,
          },
        },
      },
    });

    if (!tx) {
      throw new AppException(
        {
          code: ERROR_CODES.LEDGER_TX_NOT_FOUND,
          message: 'Ledger transaction not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return tx;
  }
}
