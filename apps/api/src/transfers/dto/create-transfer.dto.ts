import { IsEnum, IsString, Matches } from 'class-validator';
import { Currency } from '@repo/db';

export class CreateTransferDto {
  @IsString()
  toWalletId: string;

  @IsEnum(Currency)
  currency: Currency;

  // numeric string
  @IsString()
  @Matches(/^[0-9]+$/)
  amount: string;

  @IsString()
  note?: string;
}
