/*
  Warnings:

  - You are about to drop the column `darkIconPath` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `lightIconPath` on the `categories` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "categories" DROP COLUMN "darkIconPath",
DROP COLUMN "lightIconPath",
ADD COLUMN     "iconPath" TEXT;

-- CreateTable
CREATE TABLE "recipe_steps" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "recipeId" UUID NOT NULL,
    "position" INTEGER NOT NULL,
    "durationSeconds" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "recipe_steps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recipe_step_translations" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "recipeStepId" UUID NOT NULL,
    "languageCode" VARCHAR(10) NOT NULL,
    "instruction" TEXT NOT NULL,
    "timerLabel" TEXT,
    "completionCue" TEXT,
    "tip" TEXT,
    "warning" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "recipe_step_translations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "recipe_steps_recipeId_position_idx" ON "recipe_steps"("recipeId", "position");

-- CreateIndex
CREATE UNIQUE INDEX "recipe_steps_recipeId_position_key" ON "recipe_steps"("recipeId", "position");

-- CreateIndex
CREATE UNIQUE INDEX "recipe_step_translations_recipeStepId_languageCode_key" ON "recipe_step_translations"("recipeStepId", "languageCode");

-- AddForeignKey
ALTER TABLE "recipe_steps" ADD CONSTRAINT "recipe_steps_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "recipes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recipe_step_translations" ADD CONSTRAINT "recipe_step_translations_recipeStepId_fkey" FOREIGN KEY ("recipeStepId") REFERENCES "recipe_steps"("id") ON DELETE CASCADE ON UPDATE CASCADE;
