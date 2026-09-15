import {
  type CallHandler,
  type ExecutionContext,
  Injectable,
  type NestInterceptor,
} from '@nestjs/common';
import type { ApiSuccess } from '@repo/contracts';
import { map, type Observable } from 'rxjs';

/**
 * Wraps every successful controller result in the shared `{ success, code, data }`
 * envelope. `code` mirrors the HTTP status. A `204 No Content` is promoted to `200`
 * so the envelope body is valid (a 204 must not carry a body).
 */
@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, ApiSuccess<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<ApiSuccess<T>> {
    const response = context.switchToHttp().getResponse<{ statusCode: number }>();

    if (response.statusCode === 204) {
      response.statusCode = 200;
    }

    return next.handle().pipe(
      map((data) => ({
        success: true as const,
        code: response.statusCode,
        data: data ?? (null as T),
      })),
    );
  }
}
