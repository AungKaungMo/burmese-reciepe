import type { AuthUser } from '@repo/contracts';

/**
 * Augments Express' `Request` so the JWT guard can stash the verified principal
 * and downstream decorators/handlers can read it in a typed way.
 */
declare global {
  namespace Express {
    interface Request {
      authUser?: AuthUser;
    }
  }
}

export {};
