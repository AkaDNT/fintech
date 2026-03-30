import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { AppException } from 'src/common/errors/app.exception';
import { ERROR_CODES } from 'src/common/errors/error-codes';
import {
  PaymentProvider,
  SupportedPaymentProvider,
} from './providers/payment-provider.port';
import { PaymentDirection, PaymentStatus, TxKind, TxStatus } from '@repo/db';
import { PrismaService } from 'src/prisma/prisma.service';
import { parseAmount } from 'src/common/money/amount';
import { WalletErrors } from 'src/wallets/errors/wallet-error.factory';
import { PaymentErrors } from './errors/payment-error.factory';
import { PAYMENT_HOLD_TTL_MS } from './payments.constants';
import { PaymentQueryDto } from './dto/payment-query.dto';
import {
  createPaymentOutboxEvent,
  PAYMENT_EVENTS,
} from './outbox/payment-outbox.helper';
import {
  AUDIT_ACTIONS,
  AUDIT_ACTOR_TYPES,
  createAuditLog,
  getTraceId,
} from '@repo/shared';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject('PAYMENT_PROVIDERS')
    private readonly providers: PaymentProvider[],
  ) {}

  private getProviderOrThrow(name: string): PaymentProvider {
    const provider = this.providers.find((x) => x.name === name);

    if (!provider) {
      throw new AppException(
        {
          code: ERROR_CODES.VALIDATION_ERROR,
          message: `Unsupported payment provider: ${name}`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    return provider;
  }

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

  async createProviderIntent(params: {
    userId: string;
    walletId: string;
    amountStr: string;
    currency: 'VND' | 'USD';
    provider: SupportedPaymentProvider;
    merchantRef?: string;
    description?: string;
  }) {
    // 1) tạo payment nội bộ trước
    const payment = await this.createIntent({
      userId: params.userId,
      walletId: params.walletId,
      amountStr: params.amountStr,
      currency: params.currency,
      merchantRef: params.merchantRef,
      description: params.description,
    });

    // 2) gọi provider outbound
    const provider = this.getProviderOrThrow(params.provider);

    const created = await provider.createPayment({
      paymentId: payment.paymentId,
      merchantRef: payment.merchantRef,
      amount: payment.amount,
      currency: payment.currency,
      description: payment.description,
    });

    // 3) update correlation keys về payment
    await this.prisma.payment.update({
      where: { id: payment.paymentId },
      data: {
        merchantRef: created.merchantRef ?? payment.merchantRef ?? null,
        externalRef: created.externalRef ?? null,
      },
    });

    return {
      ...payment,
      merchantRef: created.merchantRef ?? payment.merchantRef ?? null,
      externalRef: created.externalRef ?? null,
      provider: params.provider,
      providerData: {
        checkoutUrl: created.checkoutUrl ?? null,
        clientSecret: created.clientSecret ?? null,
        payUrl: created.payUrl ?? null,
        deeplink: created.deeplink ?? null,
        qrCodeUrl: created.qrCodeUrl ?? null,
      },
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

      await createPaymentOutboxEvent(tx, {
        eventType: PAYMENT_EVENTS.HELD,
        paymentId: payment.id,
        userId: payment.userId,
        walletId: payment.walletId,
        amount: payment.amount,
        currency: payment.currency,
        traceId: getTraceId(),
        status: 'HELD',
      });

      await createAuditLog(tx, {
        actorType: AUDIT_ACTOR_TYPES.USER,
        actorId: params.userId,
        action: AUDIT_ACTIONS.PAYMENT_HOLD,
        entityType: 'payment',
        entityId: payment.id,
        before: {
          paymentStatus: 'CREATED',
          availableBalance: payment.wallet.availableBalance.toString(),
          lockedBalance: payment.wallet.lockedBalance.toString(),
        },
        after: {
          paymentStatus: 'HELD',
          availableBalance: updatedWallet.availableBalance.toString(),
          lockedBalance: updatedWallet.lockedBalance.toString(),
        },
        metadata: {
          walletId: payment.walletId,
          holdId: holdRecord.id,
        },
        traceId: getTraceId(),
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
        throw WalletErrors.systemWalletDisabled();
      }

      if (systemWallet.status !== 'ACTIVE') {
        throw WalletErrors.systemWalletDisabled();
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

      await createPaymentOutboxEvent(tx, {
        eventType: PAYMENT_EVENTS.CAPTURED,
        paymentId: payment.id,
        userId: payment.userId,
        walletId: payment.walletId,
        amount: payment.amount,
        currency: payment.currency,
        status: 'CAPTURED',
        traceId: getTraceId(),
        extra: {
          ledgerTxId: ledgerTx.id,
        },
      });

      await createAuditLog(tx, {
        actorType: AUDIT_ACTOR_TYPES.USER,
        actorId: params.userId,
        action: AUDIT_ACTIONS.PAYMENT_CAPTURE,
        entityType: 'payment',
        entityId: payment.id,
        before: {
          paymentStatus: 'HELD',
          lockedBalance: payment.wallet.lockedBalance.toString(),
        },
        after: {
          paymentStatus: 'CAPTURED',
          lockedBalance: updatedUserWallet.lockedBalance.toString(),
        },
        metadata: {
          walletId: payment.walletId,
          holdId: payment.holdRecord.id,
          ledgerTxId: ledgerTx.id,
        },
        traceId: getTraceId(),
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

  async cancelPayment(params: { paymentId: string; userId: string }) {
    return this.prisma.$transaction(async (tx) => {
      const payment = await tx.payment.findUnique({
        where: { id: params.paymentId },
        include: { wallet: true },
      });

      if (!payment || payment.userId !== params.userId) {
        throw PaymentErrors.paymentNotFound();
      }

      if (payment.status !== 'HELD') {
        throw PaymentErrors.paymentInvalidState('Payment is not in HELD state');
      }

      const hold = await tx.holdRecord.findUnique({
        where: { paymentId: payment.id },
      });

      if (!hold || hold.status !== 'ACTIVE') {
        throw PaymentErrors.holdNotFound();
      }

      await tx.wallet.update({
        where: { id: payment.walletId },
        data: {
          availableBalance: payment.wallet.availableBalance + payment.amount,
          lockedBalance: payment.wallet.lockedBalance - payment.amount,
        },
      });

      await tx.holdRecord.update({
        where: { paymentId: payment.id },
        data: { status: 'RELEASED' },
      });

      await tx.payment.update({
        where: { id: payment.id },
        data: { status: 'CANCELED' },
      });

      await createPaymentOutboxEvent(tx, {
        eventType: PAYMENT_EVENTS.CANCELED,
        paymentId: payment.id,
        userId: payment.userId,
        walletId: payment.walletId,
        amount: payment.amount,
        currency: payment.currency,
        traceId: getTraceId(),
        status: 'CANCELED',
      });

      await createAuditLog(tx, {
        actorType: AUDIT_ACTOR_TYPES.USER,
        actorId: params.userId,
        action: AUDIT_ACTIONS.PAYMENT_CANCEL,
        entityType: 'payment',
        entityId: payment.id,
        before: {
          paymentStatus: 'HELD',
          holdStatus: 'ACTIVE',
          availableBalance: payment.wallet.availableBalance.toString(),
          lockedBalance: payment.wallet.lockedBalance.toString(),
        },
        after: {
          paymentStatus: 'CANCELED',
          holdStatus: 'RELEASED',
        },
        metadata: {
          walletId: payment.walletId,
        },
        traceId: getTraceId(),
      });

      return {
        paymentId: payment.id,
        status: 'CANCELED',
        amount: payment.amount.toString(),
        currency: payment.currency,
      };
    });
  }

  async refundPayment(params: { paymentId: string; userId: string }) {
    return this.prisma.$transaction(async (tx) => {
      const payment = await tx.payment.findUnique({
        where: { id: params.paymentId },
        include: { wallet: true },
      });

      if (!payment || payment.userId !== params.userId) {
        throw PaymentErrors.paymentNotFound();
      }

      if (payment.status === 'REFUNDED') {
        throw PaymentErrors.paymentAlreadyRefunded();
      }

      if (payment.status !== 'CAPTURED') {
        throw PaymentErrors.refundNotAllowed();
      }

      const systemUser = await tx.user.findUnique({
        where: { email: 'system@local.test' },
        select: { id: true },
      });

      if (!systemUser) {
        throw PaymentErrors.systemUserNotFound();
      }

      const systemWallet = await tx.wallet.findUnique({
        where: {
          userId_currency: {
            userId: systemUser.id,
            currency: payment.currency,
          },
        },
      });

      if (!systemWallet) {
        throw PaymentErrors.systemWalletNotFound();
      }

      await tx.wallet.update({
        where: { id: payment.walletId },
        data: {
          availableBalance: payment.wallet.availableBalance + payment.amount,
        },
      });

      await tx.wallet.update({
        where: { id: systemWallet.id },
        data: {
          availableBalance: systemWallet.availableBalance - payment.amount,
        },
      });

      const ledgerTx = await tx.ledgerTransaction.create({
        data: {
          kind: 'REFUND',
          status: 'SUCCEEDED',
          currency: payment.currency,
          amount: payment.amount,
          reference: payment.merchantRef ?? payment.id,
          createdBy: payment.userId,
          entries: {
            create: [
              {
                walletId: systemWallet.id,
                type: 'DEBIT',
                amount: payment.amount,
                currency: payment.currency,
              },
              {
                walletId: payment.walletId,
                type: 'CREDIT',
                amount: payment.amount,
                currency: payment.currency,
              },
            ],
          },
        },
        select: { id: true, createdAt: true },
      });

      await tx.payment.update({
        where: { id: payment.id },
        data: {
          status: 'REFUNDED',
        },
      });

      await createPaymentOutboxEvent(tx, {
        eventType: PAYMENT_EVENTS.REFUNDED,
        paymentId: payment.id,
        userId: payment.userId,
        walletId: payment.walletId,
        amount: payment.amount,
        currency: payment.currency,
        status: 'REFUNDED',
        traceId: getTraceId(),
        extra: {
          refundTxId: ledgerTx.id,
        },
      });

      await createAuditLog(tx, {
        actorType: AUDIT_ACTOR_TYPES.USER,
        actorId: params.userId,
        action: AUDIT_ACTIONS.PAYMENT_REFUND,
        entityType: 'payment',
        entityId: payment.id,
        before: {
          paymentStatus: 'CAPTURED',
        },
        after: {
          paymentStatus: 'REFUNDED',
        },
        metadata: {
          walletId: payment.walletId,
          refundTxId: ledgerTx.id,
        },
        traceId: getTraceId(),
      });

      return {
        paymentId: payment.id,
        status: 'REFUNDED',
        refundTxId: ledgerTx.id,
        amount: payment.amount.toString(),
        createdAt: ledgerTx.createdAt.toISOString(),
      };
    });
  }

  async listMyPayments(userId: string, query: PaymentQueryDto) {
    return this.prisma.payment.findMany({
      where: {
        userId,
        ...(query.status ? { status: query.status } : {}),
        ...(query.currency ? { currency: query.currency } : {}),
        ...(query.merchantRef ? { merchantRef: query.merchantRef } : {}),
      },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        walletId: true,
        currency: true,
        amount: true,
        status: true,
        merchantRef: true,
        externalRef: true,
        description: true,
        ledgerTxId: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async getMyPayment(userId: string, paymentId: string) {
    const payment = await this.prisma.payment.findFirst({
      where: { id: paymentId, userId },
      select: {
        id: true,
        walletId: true,
        currency: true,
        amount: true,
        status: true,
        merchantRef: true,
        externalRef: true,
        description: true,
        ledgerTxId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!payment) {
      throw PaymentErrors.paymentNotFound();
    }

    return payment;
  }
}
