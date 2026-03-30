import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { MetricsService } from 'src/observability/metrics.service';

@Injectable()
export class HttpMetricsInterceptor implements NestInterceptor {
  constructor(private readonly metrics: MetricsService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const startedAt = Date.now();
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();

    return next.handle().pipe(
      tap({
        next: () => {
          this.metrics.httpRequestDurationMs.observe(
            {
              method: req.method,
              route: req.route?.path ?? req.url,
              statusCode: String(res.statusCode),
            },
            Date.now() - startedAt,
          );
        },
        error: () => {
          this.metrics.httpRequestDurationMs.observe(
            {
              method: req.method,
              route: req.route?.path ?? req.url,
              statusCode: String(res.statusCode || 500),
            },
            Date.now() - startedAt,
          );
        },
      }),
    );
  }
}
