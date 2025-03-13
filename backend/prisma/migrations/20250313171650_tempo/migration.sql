/*
  Warnings:

  - A unique constraint covering the columns `[mainImageId]` on the table `Product` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `mainImageId` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Image" DROP CONSTRAINT "Image_productId_fkey";

-- AlterTable
ALTER TABLE "Image" ALTER COLUMN "productId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN "mainImageId" TEXT NOT NULL DEFAULT 'default_image_id';

-- CreateIndex
CREATE UNIQUE INDEX "Product_mainImageId_key" ON "Product"("mainImageId");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_mainImageId_fkey" FOREIGN KEY ("mainImageId") REFERENCES "Image"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;
