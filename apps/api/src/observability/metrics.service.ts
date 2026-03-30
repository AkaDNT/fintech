import { Injectable } from '@nestjs/common';
import {
  Counter,
  Gauge,
  Histogram,
  Registry,
  collectDefaultMetrics,
} from 'prom-client';

@Injectable()
export class MetricsService {
  readonly registry = new Registry();

  readonly webhookDeliveryAttemptsTotal: Counter<string>;
  readonly webhookDeliverySuccessTotal: Counter<string>;
  readonly webhookDeliveryFailureTotal: Counter<string>;

  readonly inboxProcessedTotal: Counter<string>;
  readonly inboxFailedTotal: Counter<string>;

  readonly webhookDeliveryCount: Gauge<string>;
  readonly inboxMessageCount: Gauge<string>;
  readonly outboxPendingCount: Gauge<string>;

  readonly httpRequestDurationMs: Histogram<string>;

  constructor() {
    collectDefaultMetrics({ register: this.registry });

    this.webhookDeliveryAttemptsTotal = new Counter({
      name: 'webhook_delivery_attempts_total',
      help: 'Total webhook delivery attempts',
      labelNames: ['eventType'],
      registers: [this.registry],
    });

    this.webhookDeliverySuccessTotal = new Counter({
      name: 'webhook_delivery_success_total',
      help: 'Total successful webhook deliveries',
      labelNames: ['eventType'],
      registers: [this.registry],
    });

    this.webhookDeliveryFailureTotal = new Counter({
      name: 'webhook_delivery_failure_total',
      help: 'Total failed webhook deliveries',
      labelNames: ['eventType', 'reason'],
      registers: [this.registry],
    });

    this.inboxProcessedTotal = new Counter({
      name: 'inbox_processed_total',
      help: 'Total processed inbox messages',
      labelNames: ['source', 'eventType'],
      registers: [this.registry],
    });

    this.inboxFailedTotal = new Counter({
      name: 'inbox_failed_total',
      help: 'Total failed inbox messages',
      labelNames: ['source', 'eventType'],
      registers: [this.registry],
    });

    this.webhookDeliveryCount = new Gauge({
      name: 'webhook_delivery_count',
      help: 'Current webhook deliveries grouped by status',
      labelNames: ['status'],
      registers: [this.registry],
    });

    this.inboxMessageCount = new Gauge({
      name: 'inbox_message_count',
      help: 'Current inbox messages grouped by status',
      labelNames: ['status'],
      registers: [this.registry],
    });

    this.outboxPendingCount = new Gauge({
      name: 'outbox_events_pending_count',
      help: 'Current number of pending outbox events',
      registers: [this.registry],
    });

    this.httpRequestDurationMs = new Histogram({
      name: 'api_http_request_duration_ms',
      help: 'HTTP request duration in milliseconds',
      labelNames: ['method', 'route', 'statusCode'],
      buckets: [10, 25, 50, 100, 250, 500, 1000, 3000, 5000],
      registers: [this.registry],
    });
  }

  async getMetricsText(): Promise<string> {
    return this.registry.metrics();
  }
}
