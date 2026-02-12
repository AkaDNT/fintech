import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { SkipWrap } from './common/interceptors/skip-wrap.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @SkipWrap()
  @Get('/health')
  getHealthCheck(): object {
    return this.appService.getHealthCheck();
  }
}
