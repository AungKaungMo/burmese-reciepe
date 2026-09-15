import { z } from 'zod';

export const userRoleSchema = z.enum(['USER', 'ADMIN']);
export type UserRole = z.infer<typeof userRoleSchema>;

/**
 * The app-side user record returned by `GET /v1/me`. Keyed by the Supabase auth
 * user id (`AuthUser.id`). `email` is sourced live from the verified token, the
 * rest is persisted in the `profiles` table. Timestamps are ISO 8601 UTC strings.
 */
export const profileSchema = z.object({
  id: z.uuid(),
  email: z.email().nullable(),
  displayName: z.string().nullable(),
  avatarPath: z.string().nullable(),
  timezone: z.string(),
  role: userRoleSchema,
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

export type Profile = z.infer<typeof profileSchema>;
