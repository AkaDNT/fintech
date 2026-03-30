import { HttpStatus, Injectable } from '@nestjs/common';
import { createHmac } from 'crypto';
import { AppException } from 'src/common/errors/app.exception';
import { ERROR_CODES } from 'src/common/errors/error-codes';
import {
  InboundWebhookVerifier,
  VerifiedInboundWebhook,
} from './inbound-webhook-verifier.port';

function hmacSha256Hex(secret: string, data: string) {
  return createHmac('sha256', secret).update(data).digest('hex');
}

function buildMomoIpnSigningData(payload: Record<string, any>) {
  const keys = [
    'accessKey',
    'amount',
    'extraData',
    'message',
    'orderId',
    'orderInfo',
    'orderType',
    'partnerCode',
    'payType',
    'requestId',
    'responseTime',
    'resultCode',
    'transId',
  ];

  return keys
    .filter((key) => payload[key] !== undefined)
    .map((key) => `${key}=${payload[key]}`)
    .join('&');
}

function mapMomoEventType(payload: any): string {
  if (String(payload.resultCode) === '0') return 'payment.succeeded';
  return 'payment.failed';
}

@Injectable()
export class MomoProviderVerifier implements InboundWebhookVerifier {
  readonly source = 'momo';

  async verify(params: {
    headers: Record<string, string | string[] | undefined>;
    rawBody: string;
  }): Promise<VerifiedInboundWebhook> {
    let parsed: any;
    try {
      parsed = JSON.parse(params.rawBody);
    } catch {
      throw new AppException(
        {
          code: ERROR_CODES.VALIDATION_ERROR,
          message: 'Invalid JSON body',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const signature = String(parsed.signature ?? '');
    if (!signature) {
      throw new AppException(
        {
          code: ERROR_CODES.WEBHOOK_SIGNATURE_INVALID,
          message: 'Missing MoMo signature',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    const signingData = buildMomoIpnSigningData(parsed);
    const expected = hmacSha256Hex(process.env.MOMO_SECRET_KEY!, signingData);

    if (expected !== signature) {
      throw new AppException(
        {
          code: ERROR_CODES.WEBHOOK_SIGNATURE_INVALID,
          message: 'Invalid MoMo signature',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    return {
      externalId: String(parsed.transId ?? parsed.orderId ?? ''),
      eventType: mapMomoEventType(parsed),
      payload: parsed,
      occurredAt: parsed.responseTime
        ? new Date(Number(parsed.responseTime)).toISOString()
        : null,
    };
  }
}
