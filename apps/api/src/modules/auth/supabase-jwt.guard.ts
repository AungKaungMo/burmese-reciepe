import {
  Injectable,
  UnauthorizedException,
  type CanActivate,
  type ExecutionContext,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  createRemoteJWKSet,
  jwtVerify,
  type JWTPayload,
  type JWTVerifyGetKey,
} from 'jose';
import type { Request } from 'express';
import type { AuthUser } from '@repo/contracts';

/**
 * Verifies the `Authorization: Bearer <token>` header against Supabase Auth's
 * published signing keys (JWKS) and attaches the resolved {@link AuthUser} to the
 * request.
 *
 * Supabase signs access tokens with asymmetric keys (ES256) exposed at
 * `${SUPABASE_URL}/auth/v1/.well-known/jwks.json`. `createRemoteJWKSet` fetches
 * and caches them, refetching automatically when a token carries an unknown
 * `kid` (key rotation). We only trust the token's signature, issuer and audience
 * here; mapping the identity to a `Profile` row is the users module's job.
 */
@Injectable()
export class SupabaseJwtGuard implements CanActivate {
  private readonly jwks: JWTVerifyGetKey;
  private readonly issuer: string;

  constructor(config: ConfigService) {
    const supabaseUrl = config.getOrThrow<string>('SUPABASE_URL');
    this.issuer = `${supabaseUrl}/auth/v1`;
    this.jwks = createRemoteJWKSet(
      new URL(`${this.issuer}/.well-known/jwks.json`),
    );
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractBearerToken(request);

    if (!token) {
      throw new UnauthorizedException('Missing bearer token');
    }

    let payload: JWTPayload;
    try {
      ({ payload } = await jwtVerify(token, this.jwks, {
        issuer: this.issuer,
        audience: 'authenticated',
      }));
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }

    if (!payload.sub) {
      throw new UnauthorizedException('Token is missing a subject');
    }

    request.authUser = {
      id: payload.sub,
      email: typeof payload.email === 'string' ? payload.email : null,
      role: typeof payload.role === 'string' ? payload.role : null,
    } satisfies AuthUser;

    return true;
  }

  private extractBearerToken(request: Request): string | null {
    const header = request.headers.authorization;
    if (!header) return null;

    const [scheme, value] = header.split(' ');
    if (scheme?.toLowerCase() !== 'bearer' || !value) return null;

    return value;
  }
}
