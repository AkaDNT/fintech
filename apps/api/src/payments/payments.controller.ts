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
import { JwtAccessGuard } from 'src/auth/jwt-access.guard';
import { CreatePaymentIntentDto } from './dto/create-payment-intent.dto';
import { PaymentsService } from './payments.service';
import { PaymentQueryDto } from './dto/payment-query.dto';
import * as paymentProviderPort from './providers/payment-provider.port';

@Controller('payments')
@UseGuards(JwtAccessGuard)
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('intents')
  async createIntent(@Req() req: any, @Body() dto: CreatePaymentIntentDto) {
    return this.paymentsService.createIntent({
      userId: req.user.sub,
      walletId: dto.walletId,
      amountStr: dto.amount,
      currency: dto.currency,
      merchantRef: dto.merchantRef,
      externalRef: dto.externalRef,
      description: dto.description,
    });
  }

  @Post('intents/:provider')
  async createProviderIntent(
    @Req() req: any,
    @Param('provider') provider: paymentProviderPort.SupportedPaymentProvider,
    @Body() dto: CreatePaymentIntentDto,
  ) {
    return this.paymentsService.createProviderIntent({
      userId: req.user.sub,
      walletId: dto.walletId,
      amountStr: dto.amount,
      currency: dto.currency,
      provider,
      merchantRef: dto.merchantRef,
      description: dto.description,
    });
  }

  @Post('topups/intents/:provider')
  async createTopUpProviderIntent(
    @Req() req: any,
    @Param('provider') provider: paymentProviderPort.SupportedPaymentProvider,
    @Body() dto: CreatePaymentIntentDto,
  ) {
    return this.paymentsService.createTopUpProviderIntent({
      userId: req.user.sub,
      walletId: dto.walletId,
      amountStr: dto.amount,
      currency: dto.currency,
      provider,
      merchantRef: dto.merchantRef,
      description: dto.description,
    });
  }

  @Post(':paymentId/hold')
  async holdPayment(@Req() req: any, @Param('paymentId') paymentId: string) {
    return this.paymentsService.holdPayment({
      userId: req.user.sub,
      paymentId,
    });
  }

  @Post(':paymentId/capture')
  async capturePayment(@Req() req: any, @Param('paymentId') paymentId: string) {
    return this.paymentsService.capturePayment({
      userId: req.user.sub,
      paymentId,
    });
  }

  @Post(':paymentId/topup/settle')
  async settleTopUp(@Req() req: any, @Param('paymentId') paymentId: string) {
    return this.paymentsService.settleTopUp({
      userId: req.user.sub,
      paymentId,
    });
  }

  @Post(':paymentId/cancel')
  async cancel(@Req() req: any, @Param('paymentId') paymentId: string) {
    return this.paymentsService.cancelPayment({
      paymentId,
      userId: req.user.sub,
    });
  }

  @Post(':paymentId/refund')
  async refund(@Req() req: any, @Param('paymentId') paymentId: string) {
    return this.paymentsService.refundPayment({
      paymentId,
      userId: req.user.sub,
    });
  }

  @Get()
  listMine(@Req() req: any, @Query() query: PaymentQueryDto) {
    return this.paymentsService.listMyPayments(req.user.sub, query);
  }

  @Get(':paymentId')
  getMine(@Req() req: any, @Param('paymentId') paymentId: string) {
    return this.paymentsService.getMyPayment(req.user.sub, paymentId);
  }
}
