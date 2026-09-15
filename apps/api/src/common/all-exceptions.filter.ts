import {
  type ArgumentsHost,
  Catch,
  type ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { ApiError, ApiFieldError } from '@repo/contracts';
import { Prisma } from '../generated/prisma/client.js';

/**
 * Known Prisma write errors → HTTP status + message, mapped once here so services
 * can call Prisma directly without per-method try/catch. Unmapped codes fall
 * through to a logged 500.
 */
const PRISMA_ERROR_MAP: Record<string, { code: number; message: string }> = {
  P2002: { code: HttpStatus.CONFLICT, message: 'A record with these values already exists.' },
  P2025: { code: HttpStatus.NOT_FOUND, message: 'The requested record was not found.' },
  P2003: {
    code: HttpStatus.CONFLICT,
    message: 'This record is referenced by other records and cannot be changed.',
  },
};

/**
 * Renders every thrown error as the shared `{ success: false, code, message }`
 * envelope (with optional field-level `errors`). Keeps the wire format consistent
 * with successful responses so clients only parse one shape.
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<{
      status: (code: number) => { json: (body: ApiError) => void };
    }>();

    let code = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let errors: ApiFieldError[] | undefined;

    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      const mapped = PRISMA_ERROR_MAP[exception.code];
      if (mapped) {
        code = mapped.code;
        message = mapped.message;
      }
      // Unmapped Prisma codes keep the 500 default so they get logged below.
    } else if (exception instanceof HttpException) {
      code = exception.getStatus();
      const payload = exception.getResponse();

      if (typeof payload === 'string') {
        message = payload;
      } else if (payload && typeof payload === 'object') {
        const body = payload as { message?: string | string[]; errors?: ApiFieldError[] };
        if (Array.isArray(body.message)) {
          message = body.message.join(', ');
        } else if (typeof body.message === 'string') {
          message = body.message;
        }
        if (Array.isArray(body.errors)) {
          errors = body.errors;
        }
      }
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    // Server-side faults are worth a stack trace; client errors (4xx) are not.
    if (code >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(
        message,
        exception instanceof Error ? exception.stack : undefined,
      );
    }

    response.status(code).json({
      success: false,
      code,
      message,
      ...(errors ? { errors } : {}),
    });
  }
}
