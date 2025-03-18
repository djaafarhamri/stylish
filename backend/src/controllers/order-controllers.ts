import { Request, Response } from "express";
import { CartItem, PrismaClient } from "@prisma/client";
import { subMonths } from "date-fns";
import redis from "../cache/redis";

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
    await redis.del("orders:*");
    await redis.del("customers:*");
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
    await redis.del("orders:*");
    await redis.del("customers:*");

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
  const {
    search,
    status = "all",
    sortBy = "createdAt",
    sortOrder = "asc",
    page = 1,
    limit = 10,
    customerId,
  } = req.query;

  try {
    // Convert page and limit to numbers
    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 10;

    const cacheKey = `orders:${search || "all"}:${
      status || "all"
    }:${sortBy}:${sortOrder}:${pageNumber}:${limitNumber}`;
    // 🔥 Check if data is cached
    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      res.status(200).json(JSON.parse(cachedData));
      return;
    }

    const skip = (pageNumber - 1) * limitNumber;

    // Construct the where clause dynamically
    const where: any = {};

    if (customerId) {
      if ((customerId as string).split("-")[0] !== "guest") {
        where.userId = customerId;
      } else {
        where.id = parseInt((customerId as string).split("-")[1]);
      }
    }

    if (status !== "all") {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { user: { firstName: { contains: search, mode: "insensitive" } } }, // Search by user name
        { user: { lastName: { contains: search, mode: "insensitive" } } }, // Search by user name
        {
          items: {
            some: {
              variant: {
                product: { name: { contains: search, mode: "insensitive" } },
              },
            },
          },
        }, // Search by product name
        { guestFirstName: { contains: search, mode: "insensitive" } }, // Search by user name
        { guestLastName: { contains: search, mode: "insensitive" } }, // Search by user name
      ];
    }

    const orderBy: any = {};
    switch (sortBy) {
      case "id":
        orderBy.id = sortOrder;
        break;
      case "firstName":
        orderBy.user = { firstName: sortOrder };
        break;
      case "createdAt":
        orderBy.createdAt = sortOrder;
        break;
      case "status":
        orderBy.status = sortOrder; // Guests first if asc, users first if desc
        break;
      case "items":
        orderBy.items = { _count: sortOrder };
        break;
      case "total":
        orderBy.total = sortOrder;
        break;
      default:
        orderBy.createdAt = "desc"; // Default sorting
        break;
    }

    // Fetch orders with filtering, sorting, and pagination
    const orders = await prisma.order.findMany({
      where,
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
      orderBy,
      skip,
      take: limitNumber,
    });
    const totalCount = await prisma.order.count({ where });

    const responseData = {
      status: true,
      customers: orders,
      total: totalCount,
    };
    await redis.setex(cacheKey, 300, JSON.stringify(responseData));

    res.status(200).json({
      status: true,
      message: "Orders retrieved successfully",
      orders,
      total: totalCount,
    });
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
  const {
    search,
    sortBy = "lastOrder",
    sortOrder = "desc",
    page = 1,
    limit = 10,
  } = req.query;

  try {
    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 10;
    const cacheKey = `customers:${
      search || "all"
    }:${sortBy}:${sortOrder}:${pageNumber}:${limitNumber}`;
    // 🔥 Check if data is cached
    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      res.status(200).json(JSON.parse(cachedData));
      return;
    }

    const skip = (pageNumber - 1) * limitNumber;

    const userWhere: any = { role: "CUSTOMER" };
    const guestWhere: any = { isGuest: true };

    if (search) {
      const searchCondition = {
        contains: search,
        mode: "insensitive",
      };

      // Apply search filter to users
      userWhere.OR = [
        { firstName: searchCondition },
        { lastName: searchCondition },
        { email: searchCondition },
        { phone: searchCondition },
        {
          orders: {
            some: {
              items: {
                some: {
                  variant: {
                    product: { name: searchCondition },
                  },
                },
              },
            },
          },
        },
      ];

      // Apply search filter to guest orders
      guestWhere.OR = [
        { guestFirstName: searchCondition },
        { guestLastName: searchCondition },
        { guestEmail: searchCondition },
        { guestPhone: searchCondition },
      ];
    }

    // Fetch registered users
    const users = await prisma.user.findMany({
      where: userWhere,
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

    // Fetch guest orders
    const guestOrders = await prisma.order.findMany({
      where: guestWhere,
      include: { items: true },
    });

    // Transform users into customer objects
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
        (sum, order) => sum + Number(order.total || 0),
        0
      ),
    }));

    // Transform guest orders into customer objects
    const guestCustomers = guestOrders.map((order) => ({
      id: `guest-${order.id}`,
      firstName: order.guestFirstName,
      lastName: order.guestLastName,
      email: order.guestEmail,
      phone: order.guestPhone,
      isGuest: true,
      lastOrderDate: order.createdAt,
      totalSpent: Number(order.total || 0),
      orders: 1,
    }));

    // Combine customers and guest customers
    let allCustomers = [...customers, ...guestCustomers];

    // Sorting with sortOrder applied
    const orderFactor = sortOrder === "asc" ? 1 : -1;

    switch (sortBy) {
      case "lastOrder":
        allCustomers.sort(
          (a, b) =>
            orderFactor *
            ((b.lastOrderDate ? new Date(b.lastOrderDate).getTime() : 0) -
              (a.lastOrderDate ? new Date(a.lastOrderDate).getTime() : 0))
        );
        break;
      case "orders":
        allCustomers.sort((a, b) => orderFactor * (b.orders - a.orders));
        break;
      case "totalSpent":
        allCustomers.sort(
          (a, b) => orderFactor * (b.totalSpent - a.totalSpent)
        );
        break;
      case "id":
        allCustomers.sort((a, b) => orderFactor * (a.id > b.id ? 1 : -1));
        break;
      case "name":
        allCustomers.sort((a, b) => {
          if (a.firstName && b.firstName)
            return orderFactor * a.firstName.localeCompare(b.firstName);
          return 0;
        });
        break;
      case "status": // Sort by isGuest
        allCustomers.sort(
          (a, b) => orderFactor * (Number(a.isGuest) - Number(b.isGuest))
        );
        break;
    }

    // Pagination
    const totalCustomers = allCustomers.length;
    const paginatedCustomers = allCustomers.slice(skip, skip + limitNumber);

    const responseData = {
      status: true,
      customers: paginatedCustomers,
      total: totalCustomers,
    };
    await redis.setex(cacheKey, 300, JSON.stringify(responseData));

    res.status(200).json({
      status: true,
      message: "Customers retrieved successfully",
      customers: paginatedCustomers,
      total: totalCustomers,
    });
  } catch (error) {
    console.error("Error fetching customers:", error);
    res.status(500).json({ status: false, message: "Internal server error" });
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
          items: true,
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
    await redis.del("orders:*");
    await redis.del("customers:*");

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
    await redis.del("orders:*");
    await redis.del("customers:*");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Could not delete order", error });
  }
};

/**
 * @desc Get dashboard stats
 * @route GET /api/orders/stats
 * @access Private (Admin)
 */
export const getStats = async (req: Request, res: Response) => {
  try {
    // Get date ranges for comparisons
    const lastMonth = subMonths(new Date(), 1);
    // Calculate current stats
    const currentRevenue = await prisma.order.aggregate({
      _sum: { total: true },
      where: { status: "DELIVERED" },
    });

    const currentOrders = await prisma.order.count();
    const currentProducts = await prisma.product.count();
    const currentCustomers = await prisma.user.count({
      where: { orders: { some: {} } },
    });

    // Calculate past stats (last month or last week)
    const pastRevenue = await prisma.order.aggregate({
      _sum: { total: true },
      where: { status: "DELIVERED", createdAt: { lt: lastMonth } },
    });

    const pastOrders = await prisma.order.count({
      where: { createdAt: { lt: lastMonth } },
    });

    const pastProducts = await prisma.product.count({
      where: { createdAt: { lt: lastMonth } },
    });

    const pastCustomers = await prisma.user.count({
      where: { orders: { some: {} }, createdAt: { lt: lastMonth } },
    });

    // Helper function to calculate trend
    const calculateTrend = (current: number, past: number) => {
      if (past === 0) return { trend: "up", trendValue: 100 }; // Avoid division by zero
      const trendValue = ((current - past) / past) * 100;
      return {
        trend: trendValue >= 0 ? "up" : "down",
        trendValue: Math.abs(trendValue),
      };
    };

    // Compute trends
    const revenueTrend = calculateTrend(
      currentRevenue._sum.total?.toNumber() || 0,
      pastRevenue._sum.total?.toNumber() || 0
    );
    const ordersTrend = calculateTrend(currentOrders, pastOrders);
    const productsTrend = calculateTrend(currentProducts, pastProducts);
    const customersTrend = calculateTrend(currentCustomers, pastCustomers);

    // Send response
    res.json({
      totalRevenue: currentRevenue._sum.total?.toNumber() || 0,
      totalOrders: currentOrders,
      totalProducts: currentProducts,
      totalCustomers: currentCustomers,
      trends: {
        totalRevenue: revenueTrend,
        totalOrders: ordersTrend,
        totalProducts: productsTrend,
        totalCustomers: customersTrend,
      },
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getCharts = async (req: Request, res: Response) => {
  try {
    const last7Months = subMonths(new Date(), 6); // Get last 7 months including current

    // Fetch revenue data grouped by month
    const revenueData = await prisma.$queryRaw<
      { month: string; revenue: number }[]
    >`
      SELECT 
        TO_CHAR(DATE_TRUNC('month', "createdAt"), 'Mon') AS month,
        COALESCE(SUM("total")::numeric, 0) AS revenue
      FROM "Order"
      WHERE "createdAt" >= ${last7Months} AND status = 'DELIVERED'
      GROUP BY DATE_TRUNC('month', "createdAt")
      ORDER BY DATE_TRUNC('month', "createdAt");
    `;

    // Fetch order count data grouped by month
    const ordersData = await prisma.$queryRaw<
      { month: string; order_count: number }[]
    >`
      SELECT 
        TO_CHAR(DATE_TRUNC('month', "createdAt"), 'Mon') AS month,
        COUNT(*) AS order_count
      FROM "Order"
      WHERE "createdAt" >= ${last7Months}
      GROUP BY DATE_TRUNC('month', "createdAt")
      ORDER BY DATE_TRUNC('month', "createdAt");
    `;

    // Format data to match frontend
    const formattedRevenue = revenueData.map((r) => ({
      name: r.month, // "Jan", "Feb", etc.
      value: Number(r.revenue), // Convert Decimal to number
    }));

    const formattedOrders = ordersData.map((o) => ({
      name: o.month, // "Jan", "Feb", etc.
      value: Number(o.order_count),
    }));

    res.json({ revenueData: formattedRevenue, ordersData: formattedOrders });
  } catch (error) {
    console.error("Error fetching chart data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
