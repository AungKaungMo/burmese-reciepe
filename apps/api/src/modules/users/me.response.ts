import type { AuthUser, Profile } from '@repo/contracts';
import type { Profile as ProfileRow } from '../../generated/prisma/client.js';

/** Maps the persisted profile row + verified identity to the shared `Profile` contract. */
export function toProfile(row: ProfileRow, authUser: AuthUser): Profile {
  return {
    id: row.id,
    email: authUser.email,
    displayName: row.displayName,
    avatarPath: row.avatarPath,
    timezone: row.timezone,
    role: row.role,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}
