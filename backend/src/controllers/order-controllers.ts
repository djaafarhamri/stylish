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
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: {
          include: {
            variant: {
              include: {
                product: {
                  include: {
                    category: true,
                    images: true,
                    mainImage: true,
                  },
                },
              },
            },
          },
        },
        shippingAddress: true,
        user: true,
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
 * @desc Get all orders for the logged-in user
 * @route GET /api/orders
 * @access Private (Customer)
 */
export const getMyOrders = async (req: Request, res: Response) => {
  const userId = req.userId;

  try {
    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            variant: {
              include: {
                product: {
                  include: {
                    category: true,
                    images: true,
                    mainImage: true,
                  },
                },
              },
            },
          },
        },
        shippingAddress: true,
        user: true,
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
  const { userId } = req;
  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    const order = await prisma.order.findUnique({
      where: { id: parseInt(id) },
      include: {
        items: {
          include: {
            variant: {
              include: {
                product: {
                  include: {
                    category: true,
                    images: true,
                    mainImage: true,
                  },
                },
              },
            },
          },
        },
        shippingAddress: true,
        user: true,
      },
    });

    if (!order) {
      res.status(404).json({ message: "Order not found" });
      return;
    }
    if (userId && userId !== order.userId && user?.role !== "ADMIN") {
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
 * @desc Get customers
 * @route GET /api/orders/customers
 * @access Private (Admin)
 */
export const getCustomers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        orders: {
          include: {
            items: {
              include: {
                variant: {
                  include: {
                    product: { select: { price: true, salePrice: true } },
                  },
                },
              },
            },
          },
        },
      },
    });
    const guestOrders = await prisma.order.findMany({
      where: { isGuest: true },
      include: { items: true },
    });

    // Transform users into customers with last order date
    const customers = users.map((user) => ({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      isGuest: false,
      orders: user.orders.length,
      lastOrderDate: user.orders.length
        ? new Date(
            Math.max(...user.orders.map((o) => new Date(o.createdAt).getTime()))
          )
        : null,
      totalSpent: user.orders.reduce(
        (sum, order) => sum + Number(order.total),
        0
      ), // Sum total spent
    }));

    // Transform guest orders into customer format
    const guestCustomers = guestOrders.map((order) => ({
      id: `guest-${order.id}`,
      firstName: order.guestFirstName,
      lastName: order.guestLastName,
      email: order.guestEmail,
      phone: order.guestPhone,
      isGuest: true,
      lastOrderDate: order.createdAt,
      totalSpent: Number(order.total), // Guest only has one order
      orders: 1,
    }));

    // Combine both lists and sort by last order date (descending)
    const sortedCustomers = [...customers, ...guestCustomers].sort(
      (a, b) =>
        (b.lastOrderDate ? new Date(b.lastOrderDate).getTime() : 0) -
        (a.lastOrderDate ? new Date(a.lastOrderDate).getTime() : 0)
    );

    res.status(200).json({
      status: true,
      message: "Order created successfully",
      customers: sortedCustomers,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Could not retrieve order", error });
  }
};

export const getCustomerById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    let customer = null;

    // Check if the ID belongs to a registered user
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        addresses: true,
        orders: {
          include: {
            items: {
              include: {
                variant: {
                  include: {
                    product: { select: { price: true, salePrice: true } },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (user) {
      const sortedOrders = user.orders.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      const recentOrders = sortedOrders.slice(0, 3);
      customer = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        address: user?.addresses.map((address) => address.isDefault),
        joinDate: new Date(user.createdAt || Date.now()).toLocaleDateString(
          "en-US",
          {
            year: "numeric",
            month: "long",
            day: "numeric",
          }
        ),
        lastOrderDate: user.orders.length
          ? new Date(
              Math.max(
                ...user.orders.map((o) => new Date(o.createdAt).getTime())
              )
            )
          : null,
        totalSpent: user.orders.reduce(
          (sum, order) => sum + Number(order.total),
          0
        ),
        orders: user.orders.length, // Include order details
        recentOrders,
      };
    } else {
      // Check if it's a guest order
      const guestOrder = await prisma.order.findUnique({
        where: { id: Number(id.split("-")[1]), isGuest: true }, // Convert id to Number for guests
        include: {
          shippingAddress: true,
          items: true
        },
      });

      if (guestOrder) {
        customer = {
          id: `guest-${guestOrder.id}`,
          firstName: guestOrder.guestFirstName,
          lastName: guestOrder.guestLastName,
          email: guestOrder.guestEmail,
          phone: guestOrder.guestPhone,
          joinDate: new Date(
            guestOrder.createdAt || Date.now()
          ).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
          address: guestOrder.shippingAddress,
          lastOrderDate: guestOrder.createdAt,
          totalSpent: Number(guestOrder.total),
          orders: 1, // Guest only has one order
          recentOrders: [guestOrder], // Guests only have one order
        };
      }
    }

    if (!customer) {
      res.status(404).json({ status: false, message: "Customer not found" });
      return;
    }

    res.status(200).json({
      status: true,
      message: "Customer retrieved successfully",
      customer,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not retrieve customer", error });
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
