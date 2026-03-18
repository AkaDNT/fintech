import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { JwtAccessGuard } from 'src/auth/jwt-access.guard';
import { Roles } from 'src/common/roles.decorator';
import { RolesGuard } from 'src/common/roles.guard';
import { AdminPaymentsService } from './admin-payments.service';
import { PaymentQueryDto } from 'src/payments/dto/payment-query.dto';

@Controller('admin/payments')
@UseGuards(JwtAccessGuard, RolesGuard)
@Roles('ADMIN')
export class AdminPaymentsController {
  constructor(private readonly paymentsService: AdminPaymentsService) {}

  @Get()
  list(@Query() query: PaymentQueryDto) {
    return this.paymentsService.adminListPayments(query);
  }

  @Get(':paymentId')
  getOne(@Param('paymentId') paymentId: string) {
    return this.paymentsService.adminGetPayment(paymentId);
  }
}
