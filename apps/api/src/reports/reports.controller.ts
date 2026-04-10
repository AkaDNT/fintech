import {
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  Res,
  StreamableFile,
  UseGuards,
} from '@nestjs/common';
import { JwtAccessGuard } from 'src/auth/jwt-access.guard';
import { RolesGuard } from 'src/common/roles.guard';
import { Roles } from 'src/common/roles.decorator';
import { ReportsService } from './reports.service';
import { ReconcileQueryDto } from './dto/reconcile-query.dto';
import { UsersCsvQueryDto } from './dto/users-csv-query.dto';
import type { Response } from 'express';

@Controller('admin/reports')
@UseGuards(JwtAccessGuard, RolesGuard)
@Roles('ADMIN')
export class ReportsController {
  constructor(private readonly reports: ReportsService) {}

  @Post('users')
  exportUsers(@Req() req: any, @Query() q: UsersCsvQueryDto) {
    return this.reports.enqueueUsersCsv(req.traceId, q);
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

  @Get('users/files')
  listRecentUsersCsv(
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.reports.listRecentUsersCsv(limit);
  }

  @Get('users/files/:id/download')
  async downloadUsersCsv(
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { file, buffer } = await this.reports.downloadUsersCsv(id);
    const filename = file.objectKey.split('/').pop() || `${file.id}.csv`;

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Length', String(buffer.byteLength));
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    return new StreamableFile(buffer);
  }
}
