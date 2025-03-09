/*
  Warnings:

  - You are about to drop the column `status` on the `Cart` table. All the data in the column will be lost.
  - You are about to drop the column `total` on the `Cart` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Cart" DROP COLUMN "status",
DROP COLUMN "total";
