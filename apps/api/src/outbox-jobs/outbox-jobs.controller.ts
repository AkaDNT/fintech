import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAccessGuard } from 'src/auth/jwt-access.guard';
import { RolesGuard } from 'src/common/roles.guard';
import { Roles } from 'src/common/roles.decorator';
import { OutboxJobsService } from './outbox-jobs.service';

@Controller('admin/outbox')
@UseGuards(JwtAccessGuard, RolesGuard)
@Roles('ADMIN')
export class OutboxJobsController {
  constructor(private readonly jobs: OutboxJobsService) {}

  @Post('publish/run')
  runPublish(@Req() req: any) {
    return this.jobs.enqueuePublish(req.traceId);
  }
}
