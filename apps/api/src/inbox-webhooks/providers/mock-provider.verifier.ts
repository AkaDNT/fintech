import { HttpStatus, Injectable } from '@nestjs/common';
import { createHmac } from 'crypto';
import { AppException } from 'src/common/errors/app.exception';
import { ERROR_CODES } from 'src/common/errors/error-codes';
import {
  InboundWebhookVerifier,
  VerifiedInboundWebhook,
} from './inbound-webhook-verifier.port';

@Injectable()
export class MockProviderVerifier implements InboundWebhookVerifier {
  readonly source = 'mock-gateway';

  async verify(params: {
    headers: Record<string, string | string[] | undefined>;
    rawBody: string;
  }): Promise<VerifiedInboundWebhook> {
    const timestamp = String(params.headers['x-webhook-timestamp'] ?? '');
    const signature = String(params.headers['x-webhook-signature'] ?? '');
    const secret = process.env.MOCK_PROVIDER_WEBHOOK_SECRET!;

    if (!timestamp || !signature) {
      throw new AppException(
        {
          code: ERROR_CODES.WEBHOOK_SIGNATURE_INVALID,
          message: 'Missing mock webhook signature headers',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    const expected = createHmac('sha256', secret)
      .update(`${timestamp}.${params.rawBody}`)
      .digest('hex');

    if (expected !== signature) {
      throw new AppException(
        {
          code: ERROR_CODES.WEBHOOK_SIGNATURE_INVALID,
          message: 'Invalid mock webhook signature',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

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

    return {
      externalId: String(parsed.id ?? ''),
      eventType: String(parsed.eventType ?? ''),
      payload: parsed,
      occurredAt:
        typeof parsed.occurredAt === 'string' ? parsed.occurredAt : null,
    };
  }
}
