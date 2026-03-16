import { HttpStatus } from '@nestjs/common';
import { AppException } from 'src/common/errors/app.exception';
import { ERROR_CODES } from 'src/common/errors/error-codes';

export const PaymentErrors = {
  paymentNotFound() {
    return new AppException(
      {
        code: ERROR_CODES.PAYMENT_NOT_FOUND,
        message: 'Payment not found',
      },
      HttpStatus.NOT_FOUND,
    );
  },

  paymentInvalidState(message = 'Payment is in invalid state') {
    return new AppException(
      {
        code: ERROR_CODES.PAYMENT_INVALID_STATE,
        message,
      },
      HttpStatus.BAD_REQUEST,
    );
  },

  paymentAlreadyCaptured() {
    return new AppException(
      {
        code: ERROR_CODES.PAYMENT_ALREADY_CAPTURED,
        message: 'Payment already captured',
      },
      HttpStatus.CONFLICT,
    );
  },

  paymentAlreadyCanceled() {
    return new AppException(
      {
        code: ERROR_CODES.PAYMENT_ALREADY_CANCELED,
        message: 'Payment already canceled',
      },
      HttpStatus.CONFLICT,
    );
  },

  paymentAlreadyRefunded() {
    return new AppException(
      {
        code: ERROR_CODES.PAYMENT_ALREADY_REFUNDED,
        message: 'Payment already refunded',
      },
      HttpStatus.CONFLICT,
    );
  },

  refundNotAllowed() {
    return new AppException(
      {
        code: ERROR_CODES.PAYMENT_REFUND_NOT_ALLOWED,
        message: 'Only captured payment can be refunded',
      },
      HttpStatus.BAD_REQUEST,
    );
  },

  holdNotFound() {
    return new AppException(
      {
        code: ERROR_CODES.HOLD_NOT_FOUND,
        message: 'Hold record not found',
      },
      HttpStatus.NOT_FOUND,
    );
  },

  holdExpired() {
    return new AppException(
      {
        code: ERROR_CODES.HOLD_EXPIRED,
        message: 'Hold has expired',
      },
      HttpStatus.BAD_REQUEST,
    );
  },

  insufficientAvailableFunds() {
    return new AppException(
      {
        code: ERROR_CODES.INSUFFICIENT_AVAILABLE_FUNDS,
        message: 'Insufficient available funds',
      },
      HttpStatus.BAD_REQUEST,
    );
  },
};
