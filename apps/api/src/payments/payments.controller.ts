import { Body, Controller, Param, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAccessGuard } from 'src/auth/jwt-access.guard';
import { CreatePaymentIntentDto } from './dto/create-payment-intent.dto';
import { PaymentsService } from './payments.service';

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
}
