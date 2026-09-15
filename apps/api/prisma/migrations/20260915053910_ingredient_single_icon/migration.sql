/*
  Warnings:

  - You are about to drop the column `darkIconPath` on the `ingredients` table. All the data in the column will be lost.
  - You are about to drop the column `lightIconPath` on the `ingredients` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ingredients" DROP COLUMN "darkIconPath",
DROP COLUMN "lightIconPath",
ADD COLUMN     "iconPath" TEXT;
