import { Controller, Post, Req, UseGuards } from '@nestjs/common';

import { JwtAccessGuard } from 'src/auth/jwt-access.guard';
import { RolesGuard } from 'src/common/roles.guard';
import { Roles } from 'src/common/roles.decorator';
import { PaymentsJobsService } from './payments-jobs.service';
import * as traceMiddleware from 'src/common/trace/trace.middleware';

@Controller('admin/payments')
@UseGuards(JwtAccessGuard, RolesGuard)
@Roles('ADMIN')
export class PaymentsJobsController {
  constructor(private readonly jobs: PaymentsJobsService) {}

  @Post('expire-holds/run')
  runExpireHolds(@Req() req: traceMiddleware.RequestWithTraceId) {
    return this.jobs.enqueueExpireHolds(req.traceId ?? 'unknown');
  }
}
