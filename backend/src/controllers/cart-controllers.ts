import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ✅ 1. Get User's Cart
export const getCart = async (req: Request, res: Response) => {
  const userId = req.userId;

  try {
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: { variant: { include: { product: true, color: true } } },
        },
      },
    });

    if (!cart) {
      res.status(200).json({
        status: true,
        message: "cart fetched successfully",
        cart: undefined,
      });
      return;
    }

    res.json({ status: true, message: "cart fetched successfully", cart });
  } catch (error) {
    res.status(500).json({ message: "Error fetching cart" });
  }
};

// ✅ 2. Add Product to Cart
export const addToCart = async (req: Request, res: Response) => {
  const userId = req.userId;
  const { variantId, quantity } = req.body;

  try {
    let cart = await prisma.cart.findUnique({ where: { userId } });

    if (!cart) {
      cart = await prisma.cart.create({ data: { userId } });
    }

    const variant = await prisma.productVariant.findUnique({
      where: { id: variantId },
    });

    if (!variant) {
      res.status(404).json({ message: "Product not found" });
      return;
    }

    const existingCartItem = await prisma.cartItem.findFirst({
      where: { cartId: cart.id, variantId },
    });

    if (existingCartItem) {
      await prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: { quantity },
      });
    } else {
      await prisma.cartItem.create({
        data: { cartId: cart.id, variantId, quantity },
      });
    }

    const updatedCart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            variant: {
              include: {
                product: true,
                color: true,
              },
            },
          },
        },
      },
    });

    res.json({
      status: true,
      message: "Item added to cart",
      cart: updatedCart,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ status: false, message: "Error adding product to cart" });
  }
};

// ✅ 4. Remove Item from Cart
export const removeCartItem = async (req: Request, res: Response) => {
  const { variantId } = req.params;
    console.log(variantId)
  try {
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        cart: {
            userId: req.userId
        },
        variantId: variantId,
      },
    });

    if (!cartItem) {
      res.status(404).json({ message: "Cart item not found" });
      return;
    }

    await prisma.cartItem.delete({
      where: { id: cartItem.id },
    });

    const updatedCart = await prisma.cart.findUnique({
      where: { userId: req.userId },
      include: {
        items: {
          include: {
            variant: {
              include: {
                product: true,
                color: true,
              },
            },
          },
        },
      },
    });

    res.json({
      status: true,
      message: "Item removed from cart",
      cart: updatedCart,
    });
  } catch (error) {
    console.error("Error removing cart item:", error);
    res.status(500).json({ message: "Error removing cart item" });
  }
};
