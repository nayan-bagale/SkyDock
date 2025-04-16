/*
  Warnings:

  - You are about to drop the column `background` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `theme` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "background",
DROP COLUMN "theme";
