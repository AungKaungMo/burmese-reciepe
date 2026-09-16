/*
  Warnings:

  - You are about to drop the column `myanmarLabel` on the `measurement_units` table. All the data in the column will be lost.
  - You are about to drop the column `sortOrder` on the `measurement_units` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "measurement_units" DROP COLUMN "myanmarLabel",
DROP COLUMN "sortOrder";

-- CreateTable
CREATE TABLE "nutrients" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "code" VARCHAR(50) NOT NULL,
    "defaultUnitId" UUID NOT NULL,
    "iconPath" TEXT,

    CONSTRAINT "nutrients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nutrient_translations" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "nutrientId" UUID NOT NULL,
    "languageCode" VARCHAR(10) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,

    CONSTRAINT "nutrient_translations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "measurement_unit_translations" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "unitId" UUID NOT NULL,
    "languageCode" VARCHAR(10) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "shortLabel" VARCHAR(30) NOT NULL,

    CONSTRAINT "measurement_unit_translations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recipe_nutrients" (
    "recipeId" UUID NOT NULL,
    "nutrientId" UUID NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "isEstimated" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "recipe_nutrients_pkey" PRIMARY KEY ("recipeId","nutrientId")
);

-- CreateIndex
CREATE UNIQUE INDEX "nutrients_code_key" ON "nutrients"("code");

-- CreateIndex
CREATE INDEX "nutrient_translations_languageCode_name_idx" ON "nutrient_translations"("languageCode", "name");

-- CreateIndex
CREATE UNIQUE INDEX "nutrient_translations_nutrientId_languageCode_key" ON "nutrient_translations"("nutrientId", "languageCode");

-- CreateIndex
CREATE INDEX "measurement_unit_translations_languageCode_name_idx" ON "measurement_unit_translations"("languageCode", "name");

-- CreateIndex
CREATE UNIQUE INDEX "measurement_unit_translations_unitId_languageCode_key" ON "measurement_unit_translations"("unitId", "languageCode");

-- CreateIndex
CREATE INDEX "recipe_nutrients_nutrientId_idx" ON "recipe_nutrients"("nutrientId");

-- AddForeignKey
ALTER TABLE "nutrients" ADD CONSTRAINT "nutrients_defaultUnitId_fkey" FOREIGN KEY ("defaultUnitId") REFERENCES "measurement_units"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nutrient_translations" ADD CONSTRAINT "nutrient_translations_nutrientId_fkey" FOREIGN KEY ("nutrientId") REFERENCES "nutrients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "measurement_unit_translations" ADD CONSTRAINT "measurement_unit_translations_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "measurement_units"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recipe_nutrients" ADD CONSTRAINT "recipe_nutrients_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "recipes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recipe_nutrients" ADD CONSTRAINT "recipe_nutrients_nutrientId_fkey" FOREIGN KEY ("nutrientId") REFERENCES "nutrients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
