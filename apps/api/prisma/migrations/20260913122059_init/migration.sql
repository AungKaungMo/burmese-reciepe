-- CreateEnum
CREATE TYPE "LanguageCode" AS ENUM ('MY', 'EN', 'JP');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "RecipeStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "RecipeDifficulty" AS ENUM ('EASY', 'MEDIUM', 'HARD');

-- CreateEnum
CREATE TYPE "SpiceLevel" AS ENUM ('NONE', 'MILD', 'MEDIUM', 'HOT');

-- CreateEnum
CREATE TYPE "TranslationStatus" AS ENUM ('DRAFT', 'REVIEWED');

-- CreateTable
CREATE TABLE "profiles" (
    "id" UUID NOT NULL,
    "displayName" TEXT,
    "avatarPath" TEXT,
    "timezone" TEXT NOT NULL DEFAULT 'Asia/Yangon',
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recipes" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "slug" TEXT NOT NULL,
    "status" "RecipeStatus" NOT NULL DEFAULT 'DRAFT',
    "cuisineCode" TEXT NOT NULL DEFAULT 'BURMESE',
    "coverImagePath" TEXT,
    "servings" INTEGER NOT NULL,
    "prepMinutes" INTEGER NOT NULL DEFAULT 0,
    "cookMinutes" INTEGER NOT NULL DEFAULT 0,
    "difficulty" "RecipeDifficulty" NOT NULL DEFAULT 'EASY',
    "spiceLevel" "SpiceLevel" NOT NULL DEFAULT 'MILD',
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "recipes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recipe_translations" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "recipeId" UUID NOT NULL,
    "languageCode" VARCHAR(10) NOT NULL,
    "title" VARCHAR(160) NOT NULL,
    "summary" VARCHAR(300),
    "overview" TEXT,
    "goodToKnow" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "servingSuggestions" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "searchKeywords" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "status" "TranslationStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "recipe_translations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "recipes_slug_key" ON "recipes"("slug");

-- CreateIndex
CREATE INDEX "recipe_translations_languageCode_title_idx" ON "recipe_translations"("languageCode", "title");

-- CreateIndex
CREATE UNIQUE INDEX "recipe_translations_recipeId_languageCode_key" ON "recipe_translations"("recipeId", "languageCode");

-- AddForeignKey
ALTER TABLE "recipe_translations" ADD CONSTRAINT "recipe_translations_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "recipes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
