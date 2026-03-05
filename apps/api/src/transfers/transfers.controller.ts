import {
  Body,
  Controller,
  Headers,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAccessGuard } from 'src/auth/jwt-access.guard';
import { AppException } from 'src/common/errors/app.exception';
import { ERROR_CODES } from 'src/common/errors/error-codes';
import { HttpStatus } from '@nestjs/common';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { TransfersService } from './transfers.service';

@Controller('transfers')
@UseGuards(JwtAccessGuard)
export class TransfersController {
  constructor(private transfers: TransfersService) {}

  @Post()
  async create(
    @Req() req: any,
    @Headers('idempotency-key') idemKey: string,
    @Body() dto: CreateTransferDto,
  ) {
    if (!idemKey) {
      throw new AppException(
        {
          code: ERROR_CODES.IDEMPOTENCY_CONFLICT,
          message: 'Missing Idempotency-Key',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.transfers.createTransfer({
      idemKey,
      userId: req.user.sub,
      toUserId: dto.toUserId,
      currency: dto.currency,
      amountStr: dto.amount,
    });
  }
}
