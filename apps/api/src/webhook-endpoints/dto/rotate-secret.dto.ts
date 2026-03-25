import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class RotateSecretDto {
  @IsOptional()
  @IsString()
  @MinLength(16)
  @MaxLength(200)
  secret?: string;
}
