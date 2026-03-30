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

function buildPayosSigningData(data: Record<string, any>) {
  return Object.keys(data)
    .sort()
    .map((key) => `${key}=${data[key] ?? ''}`)
    .join('&');
}

function mapPayosEventType(parsed: any): string {
  const code = parsed?.code;
  if (code === '00') return 'payment.succeeded';
  return 'payment.failed';
}

@Injectable()
export class PayosProviderVerifier implements InboundWebhookVerifier {
  readonly source = 'payos';

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
    const data = parsed.data;

    if (!signature || !data) {
      throw new AppException(
        {
          code: ERROR_CODES.WEBHOOK_SIGNATURE_INVALID,
          message: 'Missing payOS signature or data',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    const signingData = buildPayosSigningData(data);
    const expected = hmacSha256Hex(
      process.env.PAYOS_CHECKSUM_KEY!,
      signingData,
    );

    if (expected !== signature) {
      throw new AppException(
        {
          code: ERROR_CODES.WEBHOOK_SIGNATURE_INVALID,
          message: 'Invalid payOS webhook signature',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    return {
      externalId: String(data.paymentLinkId ?? data.orderCode ?? ''),
      eventType: mapPayosEventType(parsed),
      payload: parsed,
      occurredAt:
        typeof data.transactionDateTime === 'string'
          ? data.transactionDateTime
          : null,
    };
  }
}
