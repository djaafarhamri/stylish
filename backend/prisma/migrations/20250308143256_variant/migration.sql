/*
  Warnings:

  - You are about to drop the column `color` on the `CartItem` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `CartItem` table. All the data in the column will be lost.
  - You are about to drop the column `size` on the `CartItem` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `Color` table. All the data in the column will be lost.
  - You are about to drop the column `value` on the `Color` table. All the data in the column will be lost.
  - You are about to drop the column `color` on the `OrderItem` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `OrderItem` table. All the data in the column will be lost.
  - You are about to drop the column `size` on the `OrderItem` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `sizes` on the `Product` table. All the data in the column will be lost.
  - Added the required column `variantId` to the `CartItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `variantId` to the `OrderItem` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CartItem" DROP CONSTRAINT "CartItem_productId_fkey";

-- DropForeignKey
ALTER TABLE "Color" DROP CONSTRAINT "Color_productId_fkey";

-- DropForeignKey
ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_productId_fkey";

-- AlterTable
ALTER TABLE "CartItem" DROP COLUMN "color",
DROP COLUMN "productId",
DROP COLUMN "size",
ADD COLUMN     "variantId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Color" DROP COLUMN "productId",
DROP COLUMN "value";

-- AlterTable
ALTER TABLE "OrderItem" DROP COLUMN "color",
DROP COLUMN "productId",
DROP COLUMN "size",
ADD COLUMN     "variantId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "quantity",
DROP COLUMN "sizes",
ADD COLUMN     "isFeatured" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "ProductVariant" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "colorId" TEXT NOT NULL,
    "size" "Size" NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ProductVariant_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProductVariant" ADD CONSTRAINT "ProductVariant_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductVariant" ADD CONSTRAINT "ProductVariant_colorId_fkey" FOREIGN KEY ("colorId") REFERENCES "Color"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "ProductVariant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "ProductVariant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
