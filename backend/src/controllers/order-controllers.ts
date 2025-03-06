import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * @desc Create an order from the cart
 * @route POST /api/orders
 * @access Private (Customer)
 */
export const createOrder = async (req: Request, res: Response) => {
    const userId = req.userId;

    try {
        // Get the user's cart
        const cart = await prisma.cart.findUnique({
            where: { userId },
            include: { items: { include: { product: true } } },
        });

        if (!cart || cart.items.length === 0) {
            res.status(400).json({ message: "Your cart is empty" });
            return;
        }

        // Calculate total price
        const total = cart.items.reduce((acc, item) => acc + item.product.price.toNumber() * item.quantity, 0);

        // Create order
        const order = await prisma.order.create({
            data: {
                userId,
                total,
                status: "PENDING",
                items: {
                    create: cart.items.map((item) => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        size: item.size,
                        color: item.color,
                    })),
                },
            },
            include: { items: true },
        });

        // Clear the cart
        await prisma.cart.update({
            where: { userId },
            data: { items: { deleteMany: {} }, total: 0 },
        });

        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ message: "Could not create order", error });
    }
};

/**
 * @desc Get all orders for the logged-in user
 * @route GET /api/orders
 * @access Private (Customer)
 */
export const getOrders = async (req: Request, res: Response) => {
    const userId = req.userId;

    try {
        const orders = await prisma.order.findMany({
            where: { userId },
            include: { items: { include: { product: true } } },
        });

        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: "Could not retrieve orders", error });
    }
};

/**
 * @desc Get order details by ID
 * @route GET /api/orders/:id
 * @access Private (Customer/Admin)
 */
export const getOrderById = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const order = await prisma.order.findUnique({
            where: { id },
            include: { items: { include: { product: true } } },
        });

        if (!order) {
            res.status(404).json({ message: "Order not found" });
            return;
        }

        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: "Could not retrieve order", error });
    }
};

/**
 * @desc Update order status (Admin only)
 * @route PATCH /api/orders/:id/status
 * @access Private (Admin)
 */
export const updateOrderStatus = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        const order = await prisma.order.update({
            where: { id },
            data: { status },
        });

        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: "Could not update order status", error });
    }
};

/**
 * @desc Delete an order (Admin only)
 * @route DELETE /api/orders/:id
 * @access Private (Admin)
 */
export const deleteOrder = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        await prisma.order.delete({ where: { id } });
        res.status(200).json({ message: "Order deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Could not delete order", error });
    }
};
