import { HttpStatus } from '@nestjs/common';
import { AppException } from '../errors/app.exception';
import { ERROR_CODES } from '../errors/error-codes';

export function parseAmount(amountStr: string): bigint {
  // Only positive integers allowed (minor units)
  if (!/^[0-9]+$/.test(amountStr)) {
    throw new AppException(
      {
        code: ERROR_CODES.AMOUNT_INVALID,
        message: 'Amount must be a numeric string',
      },
      HttpStatus.BAD_REQUEST,
    );
  }
  const v = BigInt(amountStr);
  if (v <= 0n) {
    throw new AppException(
      { code: ERROR_CODES.AMOUNT_INVALID, message: 'Amount must be > 0' },
      HttpStatus.BAD_REQUEST,
    );
  }
  return v;
}
