/*
  Warnings:

  - Changed the type of `languageCode` on the `recipe_translations` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "CategoryScope" AS ENUM ('INGREDIENT', 'RECIPE');

-- AlterTable
ALTER TABLE "recipe_translations" DROP COLUMN "languageCode",
ADD COLUMN     "languageCode" "LanguageCode" NOT NULL;

-- CreateTable
CREATE TABLE "categories" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "scope" "CategoryScope" NOT NULL,
    "code" VARCHAR(100) NOT NULL,
    "lightIconPath" TEXT,
    "darkIconPath" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "category_translations" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "categoryId" UUID NOT NULL,
    "languageCode" "LanguageCode" NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "category_translations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recipe_category_links" (
    "recipeId" UUID NOT NULL,
    "categoryId" UUID NOT NULL,

    CONSTRAINT "recipe_category_links_pkey" PRIMARY KEY ("recipeId","categoryId")
);

-- CreateTable
CREATE TABLE "measurement_units" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "code" VARCHAR(30) NOT NULL,
    "symbol" VARCHAR(20) NOT NULL,
    "myanmarLabel" VARCHAR(50) NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "measurement_units_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ingredients" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "code" VARCHAR(100) NOT NULL,
    "categoryId" UUID NOT NULL,
    "defaultUnitId" UUID,
    "emoji" TEXT,
    "lightIconPath" TEXT,
    "darkIconPath" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ingredients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ingredient_translations" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "ingredientId" UUID NOT NULL,
    "languageCode" "LanguageCode" NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "aliases" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ingredient_translations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ingredient_substitutions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "originalIngredientId" UUID NOT NULL,
    "substituteIngredientId" UUID NOT NULL,
    "originalAmount" DECIMAL(10,2),
    "originalUnitCode" VARCHAR(30),
    "substituteAmount" DECIMAL(10,2),
    "substituteUnitCode" VARCHAR(30),
    "priority" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ingredient_substitutions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ingredient_substitution_translations" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "ingredientSubstitutionId" UUID NOT NULL,
    "languageCode" "LanguageCode" NOT NULL,
    "usageInstruction" TEXT,
    "effectNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ingredient_substitution_translations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "categories_scope_isActive_sortOrder_idx" ON "categories"("scope", "isActive", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "categories_scope_code_key" ON "categories"("scope", "code");

-- CreateIndex
CREATE INDEX "category_translations_languageCode_name_idx" ON "category_translations"("languageCode", "name");

-- CreateIndex
CREATE UNIQUE INDEX "category_translations_categoryId_languageCode_key" ON "category_translations"("categoryId", "languageCode");

-- CreateIndex
CREATE INDEX "recipe_category_links_categoryId_idx" ON "recipe_category_links"("categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "measurement_units_code_key" ON "measurement_units"("code");

-- CreateIndex
CREATE UNIQUE INDEX "ingredients_code_key" ON "ingredients"("code");

-- CreateIndex
CREATE INDEX "ingredients_categoryId_isActive_idx" ON "ingredients"("categoryId", "isActive");

-- CreateIndex
CREATE INDEX "ingredient_translations_languageCode_name_idx" ON "ingredient_translations"("languageCode", "name");

-- CreateIndex
CREATE UNIQUE INDEX "ingredient_translations_ingredientId_languageCode_key" ON "ingredient_translations"("ingredientId", "languageCode");

-- CreateIndex
CREATE INDEX "ingredient_substitutions_originalIngredientId_isActive_prio_idx" ON "ingredient_substitutions"("originalIngredientId", "isActive", "priority");

-- CreateIndex
CREATE UNIQUE INDEX "ingredient_substitutions_originalIngredientId_substituteIng_key" ON "ingredient_substitutions"("originalIngredientId", "substituteIngredientId");

-- CreateIndex
CREATE UNIQUE INDEX "ingredient_substitution_translations_ingredientSubstitution_key" ON "ingredient_substitution_translations"("ingredientSubstitutionId", "languageCode");

-- CreateIndex
CREATE INDEX "recipe_translations_languageCode_title_idx" ON "recipe_translations"("languageCode", "title");

-- CreateIndex
CREATE UNIQUE INDEX "recipe_translations_recipeId_languageCode_key" ON "recipe_translations"("recipeId", "languageCode");

-- AddForeignKey
ALTER TABLE "category_translations" ADD CONSTRAINT "category_translations_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recipe_category_links" ADD CONSTRAINT "recipe_category_links_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "recipes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recipe_category_links" ADD CONSTRAINT "recipe_category_links_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ingredients" ADD CONSTRAINT "ingredients_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ingredients" ADD CONSTRAINT "ingredients_defaultUnitId_fkey" FOREIGN KEY ("defaultUnitId") REFERENCES "measurement_units"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ingredient_translations" ADD CONSTRAINT "ingredient_translations_ingredientId_fkey" FOREIGN KEY ("ingredientId") REFERENCES "ingredients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ingredient_substitutions" ADD CONSTRAINT "ingredient_substitutions_originalIngredientId_fkey" FOREIGN KEY ("originalIngredientId") REFERENCES "ingredients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ingredient_substitutions" ADD CONSTRAINT "ingredient_substitutions_substituteIngredientId_fkey" FOREIGN KEY ("substituteIngredientId") REFERENCES "ingredients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ingredient_substitution_translations" ADD CONSTRAINT "ingredient_substitution_translations_ingredientSubstitutio_fkey" FOREIGN KEY ("ingredientSubstitutionId") REFERENCES "ingredient_substitutions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
