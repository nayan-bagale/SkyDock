/*
  Warnings:

  - The primary key for the `Payment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `UserPlan` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Changed the type of `size` on the `ExplorerItems` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `storageLimit` to the `Plan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ExplorerItems" DROP COLUMN "size",
ADD COLUMN     "size" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Payment_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Payment_id_seq";

-- AlterTable
ALTER TABLE "Plan" ADD COLUMN     "storageLimit" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "usedStorage" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "UserPlan" DROP CONSTRAINT "UserPlan_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "UserPlan_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "UserPlan_id_seq";
