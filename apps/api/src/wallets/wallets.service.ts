import { Injectable } from '@nestjs/common';
import { Currency } from '@repo/db';
import { PrismaService } from 'src/prisma/prisma.service';
import { WalletErrors } from './errors/wallet-error.factory';

@Injectable()
export class WalletsService {
  constructor(private readonly prisma: PrismaService) {}
  async listMyWallets(userId: string) {
    return await this.prisma.wallet.findMany({
      where: { userId },
      orderBy: { currency: 'asc' },
      select: {
        id: true,
        currency: true,
        status: true,
        availableBalance: true,
        lockedBalance: true,
      },
    });
  }

  async ensureWallets(userId: string) {
    const currencies: Currency[] = [Currency.VND, Currency.USD];
    for (const c of currencies) {
      await this.prisma.wallet.upsert({
        where: { userId_currency: { userId, currency: c } },
        update: {},
        create: {
          userId,
          currency: c,
        },
      });
    }
  }

  async getOwnedWalletOrNotFound(params: { walletId: string; userId: string }) {
    const { walletId, userId } = params;

    const wallet = await this.prisma.wallet.findUnique({
      where: { id: walletId },
      select: { id: true, userId: true },
    });

    if (!wallet || wallet.userId !== userId) {
      throw WalletErrors.walletNotFound();
    }

    return wallet;
  }

  async getMyWalletCurrency(params: { userId: string; currency: Currency }) {
    const { userId, currency } = params;
    const wallet = await this.prisma.wallet.findUnique({
      where: {
        userId_currency: { userId, currency },
      },
      select: {
        userId: true,
      },
    });
    if (!wallet || wallet.userId != userId) {
      throw WalletErrors.walletNotFound();
    }
  }
}
