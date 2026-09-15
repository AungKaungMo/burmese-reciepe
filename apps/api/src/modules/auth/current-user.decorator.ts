import {
  createParamDecorator,
  UnauthorizedException,
  type ExecutionContext,
} from '@nestjs/common';
import type { Request } from 'express';
import type { AuthUser } from '@repo/contracts';

/**
 * Injects the verified {@link AuthUser} into a handler parameter. Must be used on
 * a route protected by {@link SupabaseJwtGuard}, which populates `request.authUser`.
 */
export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): AuthUser => {
    const request = context.switchToHttp().getRequest<Request>();

    if (!request.authUser) {
      throw new UnauthorizedException('No authenticated user on request');
    }

    return request.authUser;
  },
);
