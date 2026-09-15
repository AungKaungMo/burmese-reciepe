import type { Category } from '@repo/contracts';
import { Prisma } from '../../generated/prisma/client.js';

/** A category row loaded together with its localized translations. */
export type CategoryWithTranslations = Prisma.CategoryGetPayload<{
  include: { translations: true };
}>;

/** Maps a persisted category row (+ translations) to the shared `Category` contract. */
export function toCategory(row: CategoryWithTranslations): Category {
  return {
    id: row.id,
    scope: row.scope,
    code: row.code,
    iconPath: row.iconPath,
    sortOrder: row.sortOrder,
    isActive: row.isActive,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
    translations: row.translations.map((translation) => ({
      languageCode: translation.languageCode,
      name: translation.name,
      description: translation.description,
    })),
  };
}
