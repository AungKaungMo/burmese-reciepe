import { z } from 'zod';

/**
 * The authenticated principal resolved from a verified Supabase JWT.
 *
 * This is Supabase's identity — NOT the app's `Profile` row. It carries only what
 * the access token asserts: the user id (`sub`), and the optional email/role
 * claims. Shared across the API (token verification) and clients (typed session).
 */
export const authUserSchema = z.object({
  id: z.uuid(),
  email: z.email().nullable(),
  role: z.string().nullable(),
});

export type AuthUser = z.infer<typeof authUserSchema>;
