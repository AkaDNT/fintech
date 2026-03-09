import {
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAccessGuard } from 'src/auth/jwt-access.guard';
import { RolesGuard } from 'src/common/roles.guard';
import { Roles } from 'src/common/roles.decorator';
import { ReportsService } from './reports.service';
import { ReconcileQueryDto } from './dto/reconcile-query.dto';

@Controller('admin/reports')
@UseGuards(JwtAccessGuard, RolesGuard)
@Roles('ADMIN')
export class ReportsController {
  constructor(private readonly reports: ReportsService) {}

  @Post('users')
  exportUsers(@Req() req: any, @Query('date') date?: string) {
    return this.reports.enqueueUsersCsv(req.traceId, date);
  }

  @Post('reconcile')
  async reconcile(@Req() req: any, @Query() q: ReconcileQueryDto) {
    const job = await this.reports.enqueueReconcile(req.traceId, q.currency);
    return { jobId: job.id };
  }

  @Get('jobs/:id')
  jobStatus(@Param('id') id: string) {
    return this.reports.getJobStatus(id);
  }
}
