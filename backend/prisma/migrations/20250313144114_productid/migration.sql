/*
  Warnings:

  - You are about to drop the column `Productid` on the `Image` table. All the data in the column will be lost.
  - Added the required column `productid` to the `Image` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Image" DROP CONSTRAINT "Image_Productid_fkey";

-- AlterTable
ALTER TABLE "Image" DROP COLUMN "Productid",
ADD COLUMN     "productid" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_productid_fkey" FOREIGN KEY ("productid") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
