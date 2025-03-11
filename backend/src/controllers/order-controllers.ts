import { Request, Response } from "express";
import { CartItem, Order, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * @desc Create an order from the cart
 * @route POST /api/orders
 * @access Private (Customer)
 */

export const createOrder = async (req: Request, res: Response) => {
  const userId = req.userId;
  const {
    total,
    shippingAddress,
    addressId,
    paymentMethod,
    cardNumber,
    cardName,
    expiryDate,
    cvv,
    notes,
  } = req.body;

  try {
    if (!total || total <= 0) {
      res.status(400).json({ message: "Invalid total amount" });
      return;
    }

    // Create address if needed
    const createdAddress = !addressId
      ? await prisma.address.create({ data: shippingAddress })
      : null;
    const shippingAddressId = addressId || createdAddress?.id;

    // **Registered User Order**
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: { include: { variant: { include: { product: true } } } },
      },
    });

    if (!cart || cart.items.length === 0) {
      res.status(400).json({ message: "Your cart is empty" });
      return;
    }

    if (!shippingAddressId) {
      res.status(400).json({ message: "Shipping address is required" });
      return;
    }

    // Create order
    const order = await prisma.order.create({
      data: {
        userId,
        total,
        isGuest: false,
        status: "PENDING",
        shippingAddressId,
        paymentMethod,
        cardNumber: paymentMethod === "CREDIT" ? cardNumber : null,
        cardName: paymentMethod === "CREDIT" ? cardName : null,
        expiryDate: paymentMethod === "CREDIT" ? expiryDate : null,
        cvv: paymentMethod === "CREDIT" ? cvv : null,
        notes,
        items: {
          create: cart.items.map((item) => ({
            variantId: item.variantId,
            quantity: item.quantity,
          })),
        },
      },
      include: { items: true },
    });

    // Clear cart after order creation
    await prisma.cart.update({
      where: { userId },
      data: { items: { deleteMany: {} } },
    });

    res
      .status(201)
      .json({ status: true, message: "Order created successfully", order });
    return;
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Could not create order", error });
    return;
  }
};

// **Helper function for guest orders**
export const createGuestOrder = async (req: Request, res: Response) => {
  const {
    guestFirstName,
    guestLastName,
    guestEmail,
    guestPhone,
    items,
    total,
    shippingAddress,
    paymentMethod,
    cardNumber,
    cardName,
    expiryDate,
    cvv,
    notes,
  } = req.body;

  try {
    // Create address if needed
    const createdAddress = await prisma.address.create({
      data: shippingAddress,
    });

    const order = await prisma.order.create({
      data: {
        guestFirstName,
        guestLastName,
        guestEmail,
        guestPhone,
        isGuest: true,
        total,
        status: "PENDING",
        shippingAddressId: createdAddress.id,
        items: {
          createMany: {
            data: items.map((item: CartItem) => ({
              variantId: item.id,
              quantity: item.quantity,
            })),
          },
        },
        paymentMethod,
        cardNumber: paymentMethod === "CREDIT" ? cardNumber : null,
        cardName: paymentMethod === "CREDIT" ? cardName : null,
        expiryDate: paymentMethod === "CREDIT" ? expiryDate : null,
        cvv: paymentMethod === "CREDIT" ? cvv : null,
        notes,
      },
      include: { items: true },
    });

    res
      .status(201)
      .json({ status: true, message: "Order created successfully", order });
    return;
  } catch (error) {
    console.error("Error creating guest order:", error);
    res.status(500).json({ message: "Could not create guest order", error });
    return;
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
      include: {
        items: { include: { variant: { include: { product: true } } } },
      },
    });

    res
      .status(200)
      .json({ status: true, message: "Order created successfully", orders });
  } catch (error) {
    console.log(error);
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
  const { userId } = req
  try {
    const order = await prisma.order.findUnique({
      where: { id: parseInt(id) },
      include: {
        items: { include: { variant: { include: { product: true } } } },
        shippingAddress: true,
        user: true,
      },
    });

    if (!order) {
      res.status(404).json({ message: "Order not found" });
      return;
    }
    if (userId && userId !== order.userId) {
      res.status(403).json({ message: "not found authorised" });
      return;
    }

    res
      .status(200)
      .json({ status: true, message: "Order created successfully", order });
  } catch (error) {
    console.log(error);
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
      where: { id: parseInt(id) },
      data: { status },
    });

    res.status(200).json(order);
  } catch (error) {
    console.log(error);
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
    await prisma.order.delete({ where: { id: parseInt(id) } });
    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Could not delete order", error });
  }
};
