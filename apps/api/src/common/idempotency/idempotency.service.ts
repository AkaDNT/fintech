import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AppException } from '../errors/app.exception';
import { ERROR_CODES } from '../errors/error-codes';
import { IdemStatus } from '@repo/db';

@Injectable()
export class IdempotencyService {
  constructor(private readonly prisma: PrismaService) {}
  async start(key: string, scope: string, requestHash?: string) {
    const exist = await this.prisma.idempotencyKey.findUnique({
      where: { key },
    });

    if (exist && exist.scope !== scope) {
      throw new AppException(
        {
          code: ERROR_CODES.IDEMPOTENCY_CONFLICT,
          message: 'Idempotency key already used with different scope',
        },
        HttpStatus.CONFLICT,
      );
    }

    if (
      exist &&
      exist.requestHash &&
      requestHash &&
      exist.requestHash !== requestHash
    ) {
      throw new AppException(
        {
          code: ERROR_CODES.IDEMPOTENCY_CONFLICT,
          message: 'Idempotency key payload mismatch',
        },
        HttpStatus.CONFLICT,
      );
    }

    if (exist?.status === 'SUCCEEDED') {
      return { replay: true as const, response: exist.response };
    }
    if (exist?.status === 'IN_PROGRESS') {
      throw new AppException(
        {
          code: ERROR_CODES.IDEMPOTENCY_CONFLICT,
          message: 'Request is already in progress',
        },
        HttpStatus.CONFLICT,
      );
    }
    if (!exist) {
      await this.prisma.idempotencyKey.create({
        data: {
          key,
          scope,
          requestHash: requestHash ?? null,
          status: IdemStatus.IN_PROGRESS,
        },
      });
    } else {
      // exist FAILED -> treat as conflict; safer
      throw new AppException(
        {
          code: ERROR_CODES.IDEMPOTENCY_CONFLICT,
          message: 'Idempotency key already used',
        },
        HttpStatus.CONFLICT,
      );
    }
    return { replay: false as const };
  }

  async succeed(key: string, response: any) {
    await this.prisma.idempotencyKey.update({
      where: {
        key,
      },
      data: {
        status: IdemStatus.SUCCEEDED,
        response,
      },
    });
  }

  async fail(key: string) {
    await this.prisma.idempotencyKey.update({
      where: { key },
      data: {
        status: IdemStatus.FAILED,
      },
    });
  }
}
