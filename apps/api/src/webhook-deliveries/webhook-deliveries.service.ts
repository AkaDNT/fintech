import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AppException } from 'src/common/errors/app.exception';
import { ERROR_CODES } from 'src/common/errors/error-codes';
import { WebhookDeliveryQueryDto } from './dto/webhook-delivery-query.dto';
import { ReplayDeadDto } from './dto/replay-dead.dto';

@Injectable()
export class WebhookDeliveriesService {
  constructor(private readonly prisma: PrismaService) {}

  private async findOrThrow(id: string) {
    const row = await this.prisma.webhookDelivery.findUnique({
      where: { id },
      include: {
        endpoint: {
          select: {
            id: true,
            name: true,
            targetUrl: true,
            status: true,
          },
        },
      },
    });

    if (!row) {
      throw new AppException(
        {
          code: ERROR_CODES.RESOURCE_NOT_FOUND,
          message: 'Webhook delivery not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return row;
  }

  async list(query: WebhookDeliveryQueryDto) {
    return this.prisma.webhookDelivery.findMany({
      where: {
        ...(query.status ? { status: query.status } : {}),
        ...(query.endpointId ? { endpointId: query.endpointId } : {}),
        ...(query.eventType ? { eventType: query.eventType } : {}),
        ...(query.q
          ? {
              OR: [
                { eventType: { contains: query.q, mode: 'insensitive' } },
                { traceId: { contains: query.q, mode: 'insensitive' } },
                { lastError: { contains: query.q, mode: 'insensitive' } },
              ],
            }
          : {}),
      },
      orderBy: { createdAt: 'desc' },
      include: {
        endpoint: {
          select: {
            id: true,
            name: true,
            targetUrl: true,
            status: true,
          },
        },
      },
      take: 100,
    });
  }

  async getOne(id: string) {
    return this.findOrThrow(id);
  }

  async retryOne(id: string) {
    const row = await this.findOrThrow(id);

    if (!['FAILED', 'DEAD'].includes(row.status)) {
      throw new AppException(
        {
          code: ERROR_CODES.JOB_FAILED,
          message: 'Only FAILED or DEAD delivery can be retried',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    if (row.endpoint.status !== 'ACTIVE') {
      throw new AppException(
        {
          code: ERROR_CODES.JOB_FAILED,
          message: 'Cannot retry delivery for disabled endpoint',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.prisma.webhookDelivery.update({
      where: { id },
      data: {
        status: 'PENDING',
        attemptCount: 0,
        nextAttemptAt: new Date(),
        lastHttpStatus: null,
        lastError: null,
        responseBody: null,
      },
      select: {
        id: true,
        status: true,
        nextAttemptAt: true,
        updatedAt: true,
      },
    });
  }

  async replayDead(dto: ReplayDeadDto) {
    const rows = await this.prisma.webhookDelivery.findMany({
      where: {
        status: 'DEAD',
        ...(dto.endpointId ? { endpointId: dto.endpointId } : {}),
        ...(dto.eventType ? { eventType: dto.eventType } : {}),
        endpoint: {
          status: 'ACTIVE',
        },
      },
      orderBy: { createdAt: 'asc' },
      take: dto.limit ?? 100,
      select: { id: true },
    });

    if (rows.length === 0) {
      return {
        replayed: 0,
        ids: [],
      };
    }

    const ids = rows.map((x) => x.id);

    await this.prisma.webhookDelivery.updateMany({
      where: {
        id: { in: ids },
      },
      data: {
        status: 'PENDING',
        attemptCount: 0,
        nextAttemptAt: new Date(),
        lastHttpStatus: null,
        lastError: null,
        responseBody: null,
      },
    });

    return {
      replayed: ids.length,
      ids,
    };
  }
}
