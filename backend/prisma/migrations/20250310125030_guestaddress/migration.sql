/*
  Warnings:

  - A unique constraint covering the columns `[guesteOrderId]` on the table `Address` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `isGuest` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_userId_fkey";

-- AlterTable
ALTER TABLE "Address" ADD COLUMN     "guesteOrderId" TEXT;

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "guestEmail" TEXT,
ADD COLUMN     "guestFirstName" TEXT,
ADD COLUMN     "guestLastName" TEXT,
ADD COLUMN     "guestPhone" TEXT,
ADD COLUMN     "isGuest" BOOLEAN NOT NULL,
ALTER COLUMN "userId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Address_guesteOrderId_key" ON "Address"("guesteOrderId");

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_guesteOrderId_fkey" FOREIGN KEY ("guesteOrderId") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
