import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { JwtAccessGuard } from 'src/auth/jwt-access.guard';
import { RolesGuard } from 'src/common/roles.guard';
import { Roles } from 'src/common/roles.decorator';
import { LedgerService } from './ledger.service';

@Controller('admin/ledger')
@UseGuards(JwtAccessGuard, RolesGuard)
@Roles('ADMIN')
export class LedgerController {
  constructor(private ledger: LedgerService) {}

  @Get('transactions/:txId')
  async getTx(@Param('txId') txId: string) {
    return await this.ledger.getTransactionDetail(txId);
  }
}
