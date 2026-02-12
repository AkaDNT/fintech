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
        data,
        traceId: getTraceId(),
      })),
    );
  }
}
