/*
  Warnings:

  - Made the column `size` on table `ProductVariant` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "ProductVariant" ALTER COLUMN "size" SET NOT NULL;

-- DropEnum
DROP TYPE "Size";
