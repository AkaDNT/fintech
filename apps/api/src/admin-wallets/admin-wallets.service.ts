import { Injectable, HttpStatus } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AppException } from 'src/common/errors/app.exception';
import { ERROR_CODES } from 'src/common/errors/error-codes';
import { parseAmount } from 'src/common/money/amount';
import { Currency, EntryType, TxKind, TxStatus, WalletStatus } from '@repo/db';

@Injectable()
export class AdminWalletsService {
  constructor(private prisma: PrismaService) {}

  private async getSystemUserId(tx: PrismaService) {
    const system = await tx.user.findUnique({
      where: { email: 'system@local.test' },
      select: { id: true },
    });
    if (!system) {
      throw new AppException(
        {
          code: ERROR_CODES.SYSTEM_WALLET_NOT_FOUND,
          message: 'System user not found',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return system.id;
  }

  async credit(params: {
    adminId: string;
    walletId: string;
    amountStr: string;
    reason?: string;
  }) {
    const amount = parseAmount(params.amountStr);

    return this.prisma.$transaction(async (tx) => {
      const target = await tx.wallet.findUnique({
        where: { id: params.walletId },
      });
      if (!target) {
        throw new AppException(
          { code: ERROR_CODES.WALLET_NOT_FOUND, message: 'Wallet not found' },
          HttpStatus.NOT_FOUND,
        );
      }
      if (target.status !== WalletStatus.ACTIVE) {
        throw new AppException(
          { code: ERROR_CODES.WALLET_DISABLED, message: 'Wallet is disabled' },
          HttpStatus.FORBIDDEN,
        );
      }

      const systemUserId = await this.getSystemUserId(tx as any);
      const systemWallet = await tx.wallet.findUnique({
        where: {
          userId_currency: {
            userId: systemUserId,
            currency: target.currency as Currency,
          },
        },
      });
      if (!systemWallet) {
        throw new AppException(
          {
            code: ERROR_CODES.SYSTEM_WALLET_NOT_FOUND,
            message: 'System wallet not found',
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      // Update cache balances
      await tx.wallet.update({
        where: { id: target.id },
        data: { availableBalance: target.availableBalance + amount },
      });

      // Currently, allow system wallet to go negative
      await tx.wallet.update({
        where: { id: systemWallet.id },
        data: { availableBalance: systemWallet.availableBalance - amount },
      });

      const ledgerTx = await tx.ledgerTransaction.create({
        data: {
          kind: TxKind.ADJUSTMENT,
          status: TxStatus.SUCCEEDED,
          currency: target.currency as Currency,
          amount,
          reference: params.reason ?? null,
          createdBy: params.adminId,
          entries: {
            create: [
              // CREDIT target
              {
                walletId: target.id,
                type: EntryType.CREDIT,
                amount,
                currency: target.currency as Currency,
              },
              // DEBIT system
              {
                walletId: systemWallet.id,
                type: EntryType.DEBIT,
                amount,
                currency: target.currency as Currency,
              },
            ],
          },
        },
        select: { id: true, createdAt: true },
      });

      return {
        adjustmentTxId: ledgerTx.id,
        walletId: target.id,
        currency: target.currency,
        direction: 'CREDIT',
        amount: amount.toString(),
        createdAt: ledgerTx.createdAt.toISOString(),
      };
    });
  }

  async debit(params: {
    adminId: string;
    walletId: string;
    amountStr: string;
    reason?: string;
  }) {
    const amount = parseAmount(params.amountStr);

    return this.prisma.$transaction(async (tx) => {
      const target = await tx.wallet.findUnique({
        where: { id: params.walletId },
      });
      if (!target) {
        throw new AppException(
          { code: ERROR_CODES.WALLET_NOT_FOUND, message: 'Wallet not found' },
          HttpStatus.NOT_FOUND,
        );
      }
      if (target.status !== WalletStatus.ACTIVE) {
        throw new AppException(
          { code: ERROR_CODES.WALLET_DISABLED, message: 'Wallet is disabled' },
          HttpStatus.FORBIDDEN,
        );
      }
      if (target.availableBalance < amount) {
        throw new AppException(
          {
            code: ERROR_CODES.INSUFFICIENT_FUNDS,
            message: 'Insufficient funds',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      const systemUserId = await this.getSystemUserId(tx as any);
      const systemWallet = await tx.wallet.findUnique({
        where: {
          userId_currency: {
            userId: systemUserId,
            currency: target.currency as Currency,
          },
        },
      });
      if (!systemWallet) {
        throw new AppException(
          {
            code: ERROR_CODES.SYSTEM_WALLET_NOT_FOUND,
            message: 'System wallet not found',
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      // Update cache balances
      await tx.wallet.update({
        where: { id: target.id },
        data: { availableBalance: target.availableBalance - amount },
      });

      await tx.wallet.update({
        where: { id: systemWallet.id },
        data: { availableBalance: systemWallet.availableBalance + amount },
      });

      const ledgerTx = await tx.ledgerTransaction.create({
        data: {
          kind: TxKind.ADJUSTMENT,
          status: TxStatus.SUCCEEDED,
          currency: target.currency as Currency,
          amount,
          reference: params.reason ?? null,
          createdBy: params.adminId,
          entries: {
            create: [
              // DEBIT target
              {
                walletId: target.id,
                type: EntryType.DEBIT,
                amount,
                currency: target.currency as Currency,
              },
              // CREDIT system
              {
                walletId: systemWallet.id,
                type: EntryType.CREDIT,
                amount,
                currency: target.currency as Currency,
              },
            ],
          },
        },
        select: { id: true, createdAt: true },
      });

      return {
        adjustmentTxId: ledgerTx.id,
        walletId: target.id,
        currency: target.currency,
        direction: 'DEBIT',
        amount: amount.toString(),
        createdAt: ledgerTx.createdAt.toISOString(),
      };
    });
  }
}
