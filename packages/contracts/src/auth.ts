import { z } from 'zod';

/**
 * The authenticated principal resolved from a verified Supabase JWT.
 *
 * This is Supabase's identity — NOT the app's `Profile` row. It carries only what
 * the access token asserts: the user id (`sub`), and the optional email/role
 * claims. Shared across the API (token verification) and clients (typed session).
 */
export const authUserSchema = z.object({
  /** Supabase auth user id (JWT `sub` claim). Also the `Profile.id`. */
  id: z.uuid(),
  /** Verified email, when present on the token. */
  email: z.email().nullable(),
  /** Supabase role claim, e.g. `authenticated`. */
  role: z.string().nullable(),
});

export type AuthUser = z.infer<typeof authUserSchema>;
