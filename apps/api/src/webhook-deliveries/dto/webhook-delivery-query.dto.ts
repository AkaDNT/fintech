import { IsIn, IsOptional, IsString } from 'class-validator';

export class WebhookDeliveryQueryDto {
  @IsOptional()
  @IsIn(['PENDING', 'PROCESSING', 'SUCCEEDED', 'FAILED', 'DEAD'])
  status?: 'PENDING' | 'PROCESSING' | 'SUCCEEDED' | 'FAILED' | 'DEAD';

  @IsOptional()
  @IsString()
  endpointId?: string;

  @IsOptional()
  @IsString()
  eventType?: string;

  @IsOptional()
  @IsString()
  q?: string;
}
