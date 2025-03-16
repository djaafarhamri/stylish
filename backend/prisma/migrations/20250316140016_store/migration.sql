-- CreateTable
CREATE TABLE "Store" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Store_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SEO" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "keywords" VARCHAR NOT NULL,

    CONSTRAINT "SEO_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shipping" (
    "id" TEXT NOT NULL,
    "free" BOOLEAN NOT NULL,
    "threshold" INTEGER NOT NULL,
    "express" BOOLEAN NOT NULL,
    "fee" INTEGER NOT NULL,

    CONSTRAINT "shipping_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "credit" BOOLEAN NOT NULL,
    "paypal" BOOLEAN NOT NULL,
    "applepay" BOOLEAN NOT NULL,
    "googlepay" BOOLEAN NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notifications" (
    "id" TEXT NOT NULL,
    "orderConfirmation" BOOLEAN NOT NULL,
    "shippingConfirmation" BOOLEAN NOT NULL,
    "orderCancellation" BOOLEAN NOT NULL,
    "abandonedCart" BOOLEAN NOT NULL,

    CONSTRAINT "Notifications_pkey" PRIMARY KEY ("id")
);
