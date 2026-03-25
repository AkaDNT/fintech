import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateWebhookEndpointDto } from './dto/create-webhook-endpoint.dto';
import { WebhookEndpointQueryDto } from './dto/webhook-endpoint-query.dto';
import { RotateSecretDto } from './dto/rotate-secret.dto';
import { AppException } from 'src/common/errors/app.exception';
import { ERROR_CODES } from 'src/common/errors/error-codes';
import { randomBytes } from 'node:crypto';

@Injectable()
export class WebhookEndpointsService {
  constructor(private readonly prisma: PrismaService) {}

  private generateSecret() {
    return randomBytes(32).toString('hex');
  }

  private maskSecret(secret: string | null) {
    if (!secret) return null;
    if (secret.length <= 8) return '********';
    return `${secret.slice(0, 4)}********${secret.slice(-4)}`;
  }

  private async findOrThrow(id: string) {
    const endpoint = await this.prisma.webhookEndpoint.findUnique({
      where: { id },
    });

    if (!endpoint) {
      throw new AppException(
        {
          code: ERROR_CODES.RESOURCE_NOT_FOUND,
          message: 'Webhook endpoint not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return endpoint;
  }

  async create(dto: CreateWebhookEndpointDto) {
    const secret = dto.secret?.trim() || this.generateSecret();

    const created = await this.prisma.webhookEndpoint.create({
      data: {
        name: dto.name.trim(),
        targetUrl: dto.targetUrl,
        secret,
        eventTypes: dto.eventTypes,
        status: 'ACTIVE',
      },
      select: {
        id: true,
        name: true,
        targetUrl: true,
        eventTypes: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return {
      ...created,
      generatedSecret: secret,
    };
  }

  async list(query: WebhookEndpointQueryDto) {
    const rows = await this.prisma.webhookEndpoint.findMany({
      where: {
        ...(query.status ? { status: query.status } : {}),
        ...(query.eventType
          ? {
              eventTypes: {
                has: query.eventType,
              },
            }
          : {}),
        ...(query.q
          ? {
              OR: [
                { name: { contains: query.q, mode: 'insensitive' } },
                { targetUrl: { contains: query.q, mode: 'insensitive' } },
              ],
            }
          : {}),
      },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        targetUrl: true,
        secret: true,
        eventTypes: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            deliveries: true,
          },
        },
      },
    });

    return rows.map((x) => ({
      id: x.id,
      name: x.name,
      targetUrl: x.targetUrl,
      secretHint: this.maskSecret(x.secret),
      eventTypes: x.eventTypes,
      status: x.status,
      deliveriesCount: x._count.deliveries,
      createdAt: x.createdAt,
      updatedAt: x.updatedAt,
    }));
  }

  async getOne(id: string) {
    const row = await this.prisma.webhookEndpoint.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        targetUrl: true,
        secret: true,
        eventTypes: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        deliveries: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            eventType: true,
            status: true,
            attemptCount: true,
            lastHttpStatus: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    if (!row) {
      throw new AppException(
        {
          code: ERROR_CODES.RESOURCE_NOT_FOUND,
          message: 'Webhook endpoint not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return {
      ...row,
      secretHint: this.maskSecret(row.secret),
      secret: undefined,
    };
  }

  async disable(id: string) {
    await this.findOrThrow(id);

    return this.prisma.webhookEndpoint.update({
      where: { id },
      data: { status: 'DISABLED' },
      select: {
        id: true,
        status: true,
        updatedAt: true,
      },
    });
  }

  async enable(id: string) {
    await this.findOrThrow(id);

    return this.prisma.webhookEndpoint.update({
      where: { id },
      data: { status: 'ACTIVE' },
      select: {
        id: true,
        status: true,
        updatedAt: true,
      },
    });
  }

  async rotateSecret(id: string, dto: RotateSecretDto) {
    await this.findOrThrow(id);

    const nextSecret = dto.secret?.trim() || this.generateSecret();

    await this.prisma.webhookEndpoint.update({
      where: { id },
      data: {
        secret: nextSecret,
      },
    });

    return {
      id,
      rotated: true,
      secret: nextSecret,
    };
  }
}
