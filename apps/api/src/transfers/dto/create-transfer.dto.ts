import { IsEnum, IsOptional, IsString, Matches } from 'class-validator';
import { Currency } from '@repo/db';

export class CreateTransferDto {
  @IsString()
  toUserId: string;

  @IsEnum(Currency)
  currency: Currency;

  // numeric string
  @IsString()
  @Matches(/^[0-9]+$/)
  amount: string;

  @IsString()
  @IsOptional()
  note?: string;
}
