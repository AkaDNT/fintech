import { Body, Controller, Headers, Param, Post, Req } from '@nestjs/common';
import * as common from '@nestjs/common';
import { Request } from 'express';
import { InboxWebhooksService } from './inbox-webhooks.service';

@Controller('webhooks/provider')
export class InboxWebhooksController {
  constructor(private readonly service: InboxWebhooksService) {}

  @Post(':source')
  async receive(
    @Param('source') source: string,
    @Headers() headers: Record<string, string | string[] | undefined>,
    @Req() req: common.RawBodyRequest<Request>,
    @Body() body: any,
  ) {
    const rawBody = req.rawBody?.toString('utf8') ?? JSON.stringify(body ?? {});

    return this.service.receive({
      source,
      headers,
      rawBody,
      traceId: (req as any).traceId ?? null,
    });
  }
}
