import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PaymentStatus, Currency } from '@repo/db';

export class PaymentQueryDto {
  @IsOptional()
  @IsEnum(PaymentStatus)
  status?: PaymentStatus;

  @IsOptional()
  @IsEnum(Currency)
  currency?: Currency;

  @IsOptional()
  @IsString()
  merchantRef?: string;
}
