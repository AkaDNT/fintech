import { IsIn, IsOptional, IsString } from 'class-validator';

export class WebhookEndpointQueryDto {
  @IsOptional()
  @IsString()
  q?: string;

  @IsOptional()
  @IsIn(['ACTIVE', 'DISABLED'])
  status?: 'ACTIVE' | 'DISABLED';

  @IsOptional()
  @IsString()
  eventType?: string;
}
