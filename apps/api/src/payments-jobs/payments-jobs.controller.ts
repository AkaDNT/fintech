import { Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAccessGuard } from 'src/auth/jwt-access.guard';
import { RolesGuard } from 'src/common/roles.guard';
import { Roles } from 'src/common/roles.decorator';
import { PaymentsJobsService } from './payments-jobs.service';

@Controller('admin/payments')
@UseGuards(JwtAccessGuard, RolesGuard)
@Roles('ADMIN')
export class PaymentsJobsController {
  constructor(private readonly jobs: PaymentsJobsService) {}

  @Post('expire-holds/run')
  runExpireHolds() {
    return this.jobs.enqueueExpireHolds();
  }
}
