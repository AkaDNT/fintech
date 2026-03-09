import { IsEnum, IsOptional } from 'class-validator';
import { Currency } from '@repo/db';

export class ReconcileQueryDto {
  @IsOptional()
  @IsEnum(Currency)
  currency?: Currency;
}
