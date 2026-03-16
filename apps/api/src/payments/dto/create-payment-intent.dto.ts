import { Currency } from '@repo/db';
import {
  IsEnum,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

export class CreatePaymentIntentDto {
  @IsString()
  walletId: string;

  @IsString()
  @Matches(/^[0-9]+$/, { message: 'amount must be a numeric string' })
  amount: string;

  @IsEnum(Currency)
  currency: Currency;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  merchantRef?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  externalRef?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string;
}
