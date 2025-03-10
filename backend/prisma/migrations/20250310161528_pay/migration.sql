-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('CREDIT', 'PAYPAL', 'GOOGLEPAY', 'APPLEPAY', 'COD');

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "cardName" TEXT,
ADD COLUMN     "cardNumber" TEXT,
ADD COLUMN     "cvv" TEXT,
ADD COLUMN     "expiryDate" TEXT,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "paymentMethod" "PaymentMethod" NOT NULL DEFAULT 'COD';
