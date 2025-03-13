/*
  Warnings:

  - You are about to drop the column `productid` on the `Image` table. All the data in the column will be lost.
  - Added the required column `productId` to the `Image` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Image" DROP CONSTRAINT "Image_productid_fkey";

-- AlterTable
ALTER TABLE "Image" DROP COLUMN "productid",
ADD COLUMN     "productId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
