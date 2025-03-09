/*
  Warnings:

  - You are about to drop the column `inSale` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "inSale",
ADD COLUMN     "salePrice" DECIMAL(65,30);
