import {
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
  Matches,
} from 'class-validator';
import { Type } from 'class-transformer';

export class LedgerQueryDto {
  @IsOptional()
  @IsString()
  // ISO date + '|' + cuid (Prisma cuid usually starts with 'c' and is > 20 chars)
  @Matches(/^\d{4}-\d{2}-\d{2}T.*Z\|.+$/, {
    message: 'cursor must be in format "<createdAtISO>|<txId>"',
  })
  cursor?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 20;
}
