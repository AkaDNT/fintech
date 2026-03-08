import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { WalletsService } from './wallets.service';
import { JwtAccessGuard } from 'src/auth/jwt-access.guard';
import { RolesGuard } from 'src/common/roles.guard';
import { Roles } from 'src/common/roles.decorator';
import { LedgerService } from 'src/ledger/ledger.service';
import { LedgerQueryDto } from 'src/ledger/dto/ledger-query.dto';
import {
  parseLedgerCursorOrThrow,
  stringifyLedgerCursor,
} from 'src/common/cursor/ledger-cursor';

@Controller('wallets')
export class WalletsController {
  constructor(
    private readonly walletsService: WalletsService,
    private readonly ledger: LedgerService,
  ) {}
  @UseGuards(JwtAccessGuard)
  @Get()
  async myWallets(@Req() req: any) {
    return await this.walletsService.listMyWallets(req.user.sub);
  }

  @UseGuards(JwtAccessGuard, RolesGuard)
  @Roles('ADMIN')
  @Post('/:userId')
  async ensureWallets(@Param('userId') userId: string) {
    return await this.walletsService.ensureWallets(userId);
  }

  @UseGuards(JwtAccessGuard)
  @Get(':walletId/ledger')
  async walletLedger(
    @Req() req: any,
    @Param('walletId') walletId: string,
    @Query() query: LedgerQueryDto,
  ) {
    await this.walletsService.getOwnedWalletOrNotFound({
      walletId,
      userId: req.user.sub,
    });

    const cursorObj = parseLedgerCursorOrThrow(query.cursor);

    const res = await this.ledger.getWalletLedger({
      walletId,
      limit: query.limit ?? 20,
      cursor: cursorObj,
    });

    return {
      ...res,
      nextCursor: res.nextCursor ? stringifyLedgerCursor(res.nextCursor) : null,
    };
  }
}
