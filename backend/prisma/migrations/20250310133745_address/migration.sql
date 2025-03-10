/*
  Warnings:

  - You are about to drop the column `guesteOrderId` on the `Address` table. All the data in the column will be lost.
  - Added the required column `shippingAddressid` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Address" DROP CONSTRAINT "Address_guesteOrderId_fkey";

-- DropIndex
DROP INDEX "Address_guesteOrderId_key";

-- AlterTable
ALTER TABLE "Address" DROP COLUMN "guesteOrderId";

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "shippingAddressid" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_shippingAddressid_fkey" FOREIGN KEY ("shippingAddressid") REFERENCES "Address"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
