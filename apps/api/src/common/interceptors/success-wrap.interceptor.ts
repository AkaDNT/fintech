import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, map } from 'rxjs';
import { SKIP_WRAP_KEY } from './skip-wrap.decorator';
import { getTraceId } from '@repo/shared';

function normalizeJson(value: any): any {
  if (typeof value === 'bigint') return value.toString();

  if (value instanceof Date) return value.toISOString();

  if (Array.isArray(value)) {
    return value.map(normalizeJson);
  }

  if (value && typeof value === 'object') {
    const out: any = {};
    for (const [k, v] of Object.entries(value)) {
      out[k] = normalizeJson(v);
    }
    return out;
  }

  return value;
}

@Injectable()
export class SuccessWrapInterceptor implements NestInterceptor {
  constructor(private reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const skip = this.reflector.getAllAndOverride<boolean>(SKIP_WRAP_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (skip) return next.handle();

    return next.handle().pipe(
      map((data) => ({
        data: normalizeJson(data),
        traceId: getTraceId(),
      })),
    );
  }
}
