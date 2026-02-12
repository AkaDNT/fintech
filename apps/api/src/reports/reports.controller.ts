import {
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAccessGuard } from 'src/auth/jwt-access.guard';
import { RolesGuard } from 'src/common/roles.guard';
import { Roles } from 'src/common/roles.decorator';
import { reportsQueue } from './reports.queue';
import { AppException } from 'src/common/errors/app.exception';
import { ERROR_CODES } from 'src/common/errors/error-codes';

@Controller('admin/reports')
@UseGuards(JwtAccessGuard, RolesGuard)
@Roles('ADMIN')
export class ReportsController {
  @Post('users')
  async exportUsers(@Req() req: any, @Query('date') date?: string) {
    const traceId = req.traceId;
    const job = await reportsQueue.add('USERS_CSV', {
      date: date || null,
      traceId,
    });
    return { jobId: job.id, traceId };
  }

  @Get('jobs/:id')
  async jobStatus(@Param('id') id: string) {
    const job = await reportsQueue.getJob(id);
    if (!job)
      throw new AppException(
        { code: ERROR_CODES.JOB_NOT_FOUND, message: 'Job not found' },
        HttpStatus.NOT_FOUND,
      );

    const state = await job.getState();
    return {
      state,
      jobProgress: job.progress,
      failedReason: job.failedReason || null,
      returnvValue: job.returnvalue || null,
    };
  }
}
