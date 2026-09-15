/*
  Replaces the split `lightIconPath` / `darkIconPath` columns on `ingredients` with a
  single `iconPath`.

  Data is NOT discarded:
    1. `iconPath` is added, then backfilled with an explicit canonical-source rule
       (prefer the light icon; fall back to the dark icon). Empty strings are treated
       as absent so a blank value never wins over a real path.
    2. Before the legacy columns are dropped, both light and dark values are archived
       into `ingredient_icon_backup`, so the alternate path (and any legacy value) stays
       fully recoverable after this migration.
*/

-- 1) Add the new single icon column.
ALTER TABLE "ingredients" ADD COLUMN "iconPath" TEXT;

-- 2) Archive the legacy light/dark values so nothing is lost and both remain recoverable.
CREATE TABLE "ingredient_icon_backup" (
    "ingredientId" UUID NOT NULL,
    "lightIconPath" TEXT,
    "darkIconPath" TEXT,
    "archivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ingredient_icon_backup_pkey" PRIMARY KEY ("ingredientId")
);

INSERT INTO "ingredient_icon_backup" ("ingredientId", "lightIconPath", "darkIconPath")
SELECT "id", "lightIconPath", "darkIconPath"
FROM "ingredients"
WHERE "lightIconPath" IS NOT NULL OR "darkIconPath" IS NOT NULL;

-- 3) Backfill: canonical source is the light icon, then the dark icon.
--    NULLIF collapses empty strings to NULL so COALESCE skips blanks.
UPDATE "ingredients"
SET "iconPath" = COALESCE(NULLIF("lightIconPath", ''), NULLIF("darkIconPath", ''))
WHERE "iconPath" IS NULL;

-- 4) Legacy values are archived and backfilled — safe to drop the old columns now.
ALTER TABLE "ingredients"
DROP COLUMN "darkIconPath",
DROP COLUMN "lightIconPath";
