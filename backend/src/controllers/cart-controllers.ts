import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ✅ 1. Get User's Cart
export const getCart = async (req: Request, res: Response) => {
    const userId = req.userId;

    try {
        const cart = await prisma.cart.findUnique({
            where: { userId },
            include: { items: { include: { product: true } } }
        });

        if (!cart) {
            res.status(404).json({ message: "Cart not found" });
            return;
        }

        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: "Error fetching cart" });
    }
};

// ✅ 2. Add Product to Cart
export const addToCart = async (req: Request, res: Response) => {
    const userId = req.userId;
    const { productId, quantity, size, color } = req.body;

    try {
        let cart = await prisma.cart.findUnique({ where: { userId } });

        if (!cart) {
            cart = await prisma.cart.create({ data: { userId, total: 0, status: "PENDING" } });
        }

        const product = await prisma.product.findUnique({ where: { id: productId } });

        if (!product) {
            res.status(404).json({ message: "Product not found" });
            return;
        }

        const existingCartItem = await prisma.cartItem.findFirst({
            where: { cartId: cart.id, productId, size, color }
        });

        if (existingCartItem) {
            await prisma.cartItem.update({
                where: { id: existingCartItem.id },
                data: { quantity: existingCartItem.quantity + quantity }
            });
        } else {
            await prisma.cartItem.create({
                data: { cartId: cart.id, productId, quantity, size, color }
            });
        }

        res.json({ message: "Product added to cart" });
    } catch (error) {
        res.status(500).json({ message: "Error adding product to cart" });
    }
};

// ✅ 3. Update Cart Item Quantity
export const updateCartItem = async (req: Request, res: Response) => {
    const { itemId } = req.params;
    const { quantity } = req.body;

    try {
        const cartItem = await prisma.cartItem.findUnique({ where: { id: itemId } });

        if (!cartItem) {
            res.status(404).json({ message: "Cart item not found" });
            return;
        }

        await prisma.cartItem.update({
            where: { id: itemId },
            data: { quantity }
        });

        res.json({ message: "Cart item updated" });
    } catch (error) {
        res.status(500).json({ message: "Error updating cart item" });
    }
};

// ✅ 4. Remove Item from Cart
export const removeCartItem = async (req: Request, res: Response) => {
    const { itemId } = req.params;

    try {
        const cartItem = await prisma.cartItem.findUnique({ where: { id: itemId } });

        if (!cartItem) {
            res.status(404).json({ message: "Cart item not found" });
            return;
        }

        await prisma.cartItem.delete({ where: { id: itemId } });

        res.json({ message: "Cart item removed" });
    } catch (error) {
        res.status(500).json({ message: "Error removing cart item" });
    }
};

// ✅ 5. Clear Cart
export const clearCart = async (req: Request, res: Response) => {
    const userId = req.userId;

    try {
        const cart = await prisma.cart.findUnique({ where: { userId } });

        if (!cart) {
            res.status(404).json({ message: "Cart not found" });
            return;
        }

        await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });

        res.json({ message: "Cart cleared" });
    } catch (error) {
        res.status(500).json({ message: "Error clearing cart" });
    }
};
