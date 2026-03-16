import { HttpStatus } from '@nestjs/common';
import { AppException } from 'src/common/errors/app.exception';
import { ERROR_CODES } from 'src/common/errors/error-codes';

export const WalletErrors = {
  walletNotFound() {
    return new AppException(
      {
        code: ERROR_CODES.WALLET_NOT_FOUND,
        message: 'Wallet not found',
      },
      HttpStatus.NOT_FOUND,
    );
  },

  walletDisabled() {
    return new AppException(
      {
        code: ERROR_CODES.WALLET_DISABLED,
        message: 'Wallet is disabled',
      },
      HttpStatus.FORBIDDEN,
    );
  },

  currencyMismatch() {
    return new AppException(
      {
        code: ERROR_CODES.CURRENCY_MISMATCH,
        message: 'Currency mismatch',
      },
      HttpStatus.BAD_REQUEST,
    );
  },

  systemWalletDisabled() {
    return new AppException(
      {
        code: ERROR_CODES.SYSTEM_WALLET_NOT_FOUND,
        message: 'System wallet is disabled',
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  },
};
