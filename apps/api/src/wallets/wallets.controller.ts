import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { WalletsService } from './wallets.service';
import { JwtAccessGuard } from 'src/auth/jwt-access.guard';
import { RolesGuard } from 'src/common/roles.guard';
import { Roles } from 'src/common/roles.decorator';

@Controller('wallets')
export class WalletsController {
  constructor(private readonly walletsService: WalletsService) {}
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
}
