import { Injectable } from '@nestjs/common';
import { Currency } from '@repo/db';
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
}
