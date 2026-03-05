import { IsOptional, IsString, Matches } from 'class-validator';

export class AdjustWalletDto {
  @IsString()
  @Matches(/^[0-9]+$/)
  amount: string;

  @IsOptional()
  @IsString()
  reason?: string;
}
