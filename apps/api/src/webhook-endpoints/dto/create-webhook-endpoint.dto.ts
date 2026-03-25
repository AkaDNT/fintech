import {
  ArrayMinSize,
  IsArray,
  IsIn,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';

export class CreateWebhookEndpointDto {
  @IsString()
  @MaxLength(100)
  name!: string;

  @IsUrl({
    require_protocol: true,
  })
  targetUrl!: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  secret?: string;

  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  @IsIn(
    [
      'payment.created',
      'payment.held',
      'payment.captured',
      'payment.canceled',
      'payment.refunded',
      'payment.expired',
    ],
    { each: true },
  )
  eventTypes!: string[];
}
