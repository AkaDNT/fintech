import { HttpStatus, Injectable } from '@nestjs/common';
import { Currency } from '@repo/db';
import { AppException } from 'src/common/errors/app.exception';
import { ERROR_CODES } from 'src/common/errors/error-codes';
import { PrismaService } from 'src/prisma/prisma.service';

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
      throw new AppException(
        { code: ERROR_CODES.WALLET_NOT_FOUND, message: 'Wallet not found' },
        HttpStatus.NOT_FOUND,
      );
    }

    return wallet;
  }
}
