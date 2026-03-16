import { Injectable } from '@nestjs/common';
import { PaymentDirection, PaymentStatus, TxKind, TxStatus } from '@repo/db';
import { PrismaService } from 'src/prisma/prisma.service';
import { parseAmount } from 'src/common/money/amount';
import { WalletErrors } from 'src/wallets/errors/wallet-error.factory';
import { PaymentErrors } from './errors/payment-error.factory';
import { PAYMENT_HOLD_TTL_MS } from './payments.constants';

@Injectable()
export class PaymentsService {
  constructor(private readonly prisma: PrismaService) {}

  async createIntent(params: {
    userId: string;
    walletId: string;
    amountStr: string;
    currency: 'VND' | 'USD';
    merchantRef?: string;
    externalRef?: string;
    description?: string;
  }) {
    const amount = parseAmount(params.amountStr);

    const wallet = await this.prisma.wallet.findUnique({
      where: { id: params.walletId },
      select: {
        id: true,
        userId: true,
        currency: true,
        status: true,
      },
    });

    if (!wallet || wallet.userId !== params.userId) {
      throw WalletErrors.walletNotFound();
    }

    if (wallet.status !== 'ACTIVE') {
      throw WalletErrors.walletDisabled();
    }

    if (wallet.currency !== params.currency) {
      throw WalletErrors.currencyMismatch();
    }

    const payment = await this.prisma.payment.create({
      data: {
        userId: params.userId,
        walletId: wallet.id,
        currency: wallet.currency,
        amount,
        status: PaymentStatus.CREATED,
        direction: PaymentDirection.DEBIT,
        merchantRef: params.merchantRef ?? null,
        externalRef: params.externalRef ?? null,
        description: params.description ?? null,
      },
      select: {
        id: true,
        walletId: true,
        amount: true,
        currency: true,
        status: true,
        merchantRef: true,
        externalRef: true,
        description: true,
        createdAt: true,
      },
    });

    return {
      paymentId: payment.id,
      walletId: payment.walletId,
      amount: payment.amount.toString(),
      currency: payment.currency,
      status: payment.status,
      merchantRef: payment.merchantRef,
      externalRef: payment.externalRef,
      description: payment.description,
      createdAt: payment.createdAt.toISOString(),
    };
  }

  async holdPayment(params: { userId: string; paymentId: string }) {
    return this.prisma.$transaction(async (tx) => {
      const payment = await tx.payment.findUnique({
        where: { id: params.paymentId },
        include: {
          wallet: {
            select: {
              id: true,
              userId: true,
              currency: true,
              status: true,
              availableBalance: true,
              lockedBalance: true,
            },
          },
          holdRecord: true,
        },
      });

      if (!payment || payment.userId !== params.userId) {
        throw PaymentErrors.paymentNotFound();
      }

      if (payment.wallet.status !== 'ACTIVE') {
        throw WalletErrors.walletDisabled();
      }

      if (payment.status !== 'CREATED') {
        throw PaymentErrors.paymentInvalidState(
          'Only payment in CREATED state can be held',
        );
      }

      if (payment.holdRecord) {
        throw PaymentErrors.paymentInvalidState(
          'Payment already has a hold record',
        );
      }

      if (payment.wallet.availableBalance < payment.amount) {
        throw PaymentErrors.insufficientAvailableFunds();
      }

      const expiresAt = new Date(Date.now() + PAYMENT_HOLD_TTL_MS);

      const updatedWallet = await tx.wallet.update({
        where: { id: payment.walletId },
        data: {
          availableBalance: payment.wallet.availableBalance - payment.amount,
          lockedBalance: payment.wallet.lockedBalance + payment.amount,
        },
        select: {
          id: true,
          availableBalance: true,
          lockedBalance: true,
        },
      });

      const holdRecord = await tx.holdRecord.create({
        data: {
          paymentId: payment.id,
          walletId: payment.walletId,
          currency: payment.currency,
          amount: payment.amount,
          status: 'ACTIVE',
          expiresAt,
        },
        select: {
          id: true,
          status: true,
          expiresAt: true,
        },
      });

      const updatedPayment = await tx.payment.update({
        where: { id: payment.id },
        data: {
          status: 'HELD',
        },
        select: {
          id: true,
          walletId: true,
          amount: true,
          currency: true,
          status: true,
        },
      });

      return {
        paymentId: updatedPayment.id,
        walletId: updatedPayment.walletId,
        amount: updatedPayment.amount.toString(),
        currency: updatedPayment.currency,
        status: updatedPayment.status,
        hold: {
          holdId: holdRecord.id,
          status: holdRecord.status,
          expiresAt: holdRecord.expiresAt?.toISOString() ?? null,
        },
        walletBalance: {
          availableBalance: updatedWallet.availableBalance.toString(),
          lockedBalance: updatedWallet.lockedBalance.toString(),
        },
      };
    });
  }

  async capturePayment(params: { userId: string; paymentId: string }) {
    return this.prisma.$transaction(async (tx) => {
      const payment = await tx.payment.findUnique({
        where: { id: params.paymentId },
        include: {
          wallet: {
            select: {
              id: true,
              userId: true,
              currency: true,
              status: true,
              availableBalance: true,
              lockedBalance: true,
            },
          },
          holdRecord: true,
        },
      });

      if (!payment || payment.userId !== params.userId) {
        throw PaymentErrors.paymentNotFound();
      }

      if (payment.wallet.status !== 'ACTIVE') {
        throw WalletErrors.walletDisabled();
      }

      if (payment.status !== 'HELD') {
        throw PaymentErrors.paymentInvalidState(
          'Only payment in HELD state can be captured',
        );
      }

      if (!payment.holdRecord) {
        throw PaymentErrors.holdNotFound();
      }

      if (payment.holdRecord.status !== 'ACTIVE') {
        throw PaymentErrors.paymentInvalidState(
          'Only active hold can be captured',
        );
      }

      if (
        payment.holdRecord.expiresAt &&
        payment.holdRecord.expiresAt.getTime() < Date.now()
      ) {
        throw PaymentErrors.holdExpired();
      }

      const systemWallet = await tx.wallet.findFirst({
        where: {
          currency: payment.currency,
          user: {
            email: 'system@local.test',
          },
        },
        select: {
          id: true,
          availableBalance: true,
          lockedBalance: true,
          currency: true,
          status: true,
        },
      });

      if (!systemWallet) {
        throw WalletErrors.systemWalletDisabled;
      }

      if (systemWallet.status !== 'ACTIVE') {
        throw WalletErrors.systemWalletDisabled;
      }

      const updatedUserWallet = await tx.wallet.update({
        where: { id: payment.walletId },
        data: {
          lockedBalance: payment.wallet.lockedBalance - payment.amount,
        },
        select: {
          id: true,
          availableBalance: true,
          lockedBalance: true,
        },
      });

      await tx.wallet.update({
        where: { id: systemWallet.id },
        data: {
          availableBalance: systemWallet.availableBalance + payment.amount,
        },
      });

      const ledgerTx = await tx.ledgerTransaction.create({
        data: {
          kind: TxKind.PAYMENT,
          status: TxStatus.SUCCEEDED,
          currency: payment.currency,
          amount: payment.amount,
          reference: payment.merchantRef ?? payment.externalRef ?? payment.id,
          createdBy: params.userId,
          entries: {
            create: [
              {
                walletId: payment.walletId,
                type: 'DEBIT',
                amount: payment.amount,
                currency: payment.currency,
              },
              {
                walletId: systemWallet.id,
                type: 'CREDIT',
                amount: payment.amount,
                currency: payment.currency,
              },
            ],
          },
        },
        select: {
          id: true,
          createdAt: true,
        },
      });

      await tx.holdRecord.update({
        where: { id: payment.holdRecord.id },
        data: {
          status: 'CAPTURED',
        },
      });

      const updatedPayment = await tx.payment.update({
        where: { id: payment.id },
        data: {
          status: 'CAPTURED',
          ledgerTxId: ledgerTx.id,
        },
        select: {
          id: true,
          walletId: true,
          amount: true,
          currency: true,
          status: true,
          ledgerTxId: true,
        },
      });

      return {
        paymentId: updatedPayment.id,
        walletId: updatedPayment.walletId,
        amount: updatedPayment.amount.toString(),
        currency: updatedPayment.currency,
        status: updatedPayment.status,
        ledgerTxId: updatedPayment.ledgerTxId,
        capturedAt: ledgerTx.createdAt.toISOString(),
        walletBalance: {
          availableBalance: updatedUserWallet.availableBalance.toString(),
          lockedBalance: updatedUserWallet.lockedBalance.toString(),
        },
      };
    });
  }
}
