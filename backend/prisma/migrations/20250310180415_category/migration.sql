/*
  Warnings:

  - You are about to drop the column `categoryid` on the `Product` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_categoryid_fkey";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "categoryid",
ADD COLUMN     "categoryName" TEXT NOT NULL DEFAULT 'ALL';

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_categoryName_fkey" FOREIGN KEY ("categoryName") REFERENCES "Category"("name") ON DELETE RESTRICT ON UPDATE CASCADE;
