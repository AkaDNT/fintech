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

@Controller('admin/reports')
@UseGuards(JwtAccessGuard, RolesGuard)
@Roles('ADMIN')
export class ReportsController {
  constructor(private readonly reports: ReportsService) {}

  @Post('users')
  exportUsers(@Query('date') date?: string) {
    return this.reports.enqueueUsersCsv(date);
  }

  @Get('jobs/:id')
  jobStatus(@Param('id') id: string) {
    return this.reports.getJobStatus(id);
  }
}
