import { Body, Controller, Param, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAccessGuard } from 'src/auth/jwt-access.guard';
import { RolesGuard } from 'src/common/roles.guard';
import { Roles } from 'src/common/roles.decorator';
import { AdminWalletsService } from './admin-wallets.service';
import { AdjustWalletDto } from './dto/adjust-wallet.dto';

@Controller('admin/wallets')
@UseGuards(JwtAccessGuard, RolesGuard)
@Roles('ADMIN')
export class AdminWalletsController {
  constructor(private adminWallets: AdminWalletsService) {}

  @Post(':walletId/credit')
  credit(
    @Req() req: any,
    @Param('walletId') walletId: string,
    @Body() dto: AdjustWalletDto,
  ) {
    return this.adminWallets.credit({
      adminId: req.user.sub,
      walletId,
      amountStr: dto.amount,
      reason: dto.reason,
    });
  }

  @Post(':walletId/debit')
  debit(
    @Req() req: any,
    @Param('walletId') walletId: string,
    @Body() dto: AdjustWalletDto,
  ) {
    return this.adminWallets.debit({
      adminId: req.user.sub,
      walletId,
      amountStr: dto.amount,
      reason: dto.reason,
    });
  }
}
