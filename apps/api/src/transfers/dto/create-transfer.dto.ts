import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { Currency } from '@repo/db';

export class CreateTransferDto {
  @IsEmail()
  toUserEmail: string;

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
