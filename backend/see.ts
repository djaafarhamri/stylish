import {
  PrismaClient,
  UserRole,
  PaymentMethod,
  OrderStatus,
  OrderItem,
  User,
  Product,
  Cart,
} from "@prisma/client";
import { faker } from "@faker-js/faker";
import { hash } from "bcrypt";

const prisma = new PrismaClient();

const now = new Date();
// Utility functions
const randomInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;
const randomFloat = (min: number, max: number, decimals: number = 2) =>
  parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
const randomElement = <T>(array: T[]): T =>
  array[Math.floor(Math.random() * array.length)];
const randomElements = <T>(array: T[], count: number): T[] => {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Generate a date within the past year
const randomDateWithinPastYear = () => {
  const oneYearAgo = new Date(now);
  oneYearAgo.setFullYear(now.getFullYear() - 1);
  return new Date(
    oneYearAgo.getTime() +
      Math.random() * (now.getTime() - oneYearAgo.getTime())
  );
};

// Create a consistent date for updates (a few days after creation)
const getUpdateDate = (createdAt: Date) => {
  const updateDate = new Date(createdAt);
  updateDate.setDate(updateDate.getDate() + randomInt(1, 10));
  return updateDate;
};

// Seed data
async function main() {
  console.log("🌱 Starting database seeding...");

  // Clean up existing data (optional - comment out if not needed)
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.image.deleteMany();
  await prisma.category.deleteMany();
  await prisma.color.deleteMany();
  await prisma.address.deleteMany();
  await prisma.user.deleteMany();
  await prisma.store.deleteMany();
  await prisma.sEO.deleteMany();
  await prisma.shipping.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.notifications.deleteMany();

  console.log("Database cleaned up");

  // Create store settings
  await prisma.store.create({
    data: {
      name: "Elegance Apparel",
      email: "contact@eleganceapparel.com",
      phone: "+213 555 1234",
      currency: "DZD",
      address: "123 Fashion Street, Algiers, Algeria",
      description: "Premium fashion for the modern individual.",
    },
  });

  // Create SEO settings
  await prisma.sEO.create({
    data: {
      title: "Elegance Apparel - Premium Fashion Store",
      description:
        "Discover the latest in fashion trends and premium apparel for men and women.",
      keywords:
        "fashion, clothing, apparel, dresses, shirts, pants, accessories, shoes",
    },
  });

  // Create shipping settings
  await prisma.shipping.create({
    data: {
      free: true,
      threshold: 50,
      express: true,
      fee: 10,
    },
  });

  // Create payment settings
  await prisma.payment.create({
    data: {
      credit: true,
      paypal: true,
      applepay: true,
      googlepay: true,
    },
  });

  // Create notification settings
  await prisma.notifications.create({
    data: {
      orderConfirmation: true,
      shippingConfirmation: true,
      orderCancellation: true,
      abandonedCart: true,
    },
  });

  // Create categories
  const categories = [
    { name: "Dresses" },
    { name: "Shirts" },
    { name: "Pants" },
    { name: "Jackets" },
    { name: "Accessories" },
    { name: "Shoes" },
    { name: "Sportswear" },
    { name: "Formal Wear" },
  ];

  for (const category of categories) {
    await prisma.category.create({
      data: category,
    });
  }

  console.log(`Created ${categories.length} categories`);

  // Create colors
  let colors = [
    { id: "1", name: "Black", hex: "#000000" },
    { id: "2", name: "White", hex: "#FFFFFF" },
    { id: "3", name: "Red", hex: "#FF0000" },
    { id: "4", name: "Blue", hex: "#0000FF" },
    { id: "5", name: "Green", hex: "#008000" },
    { id: "6", name: "Yellow", hex: "#FFFF00" },
    { id: "7", name: "Purple", hex: "#800080" },
    { id: "8", name: "Orange", hex: "#FFA500" },
    { id: "9", name: "Pink", hex: "#FFC0CB" },
    { id: "10", name: "Gray", hex: "#808080" },
    { id: "11", name: "Brown", hex: "#A52A2A" },
    { id: "12", name: "Navy", hex: "#000080" },
  ];

  for (const color of colors) {
    await prisma.color.create({
      data: color,
    });
  }

  colors = await prisma.color.findMany({});

  console.log(`Created ${colors.length} colors`);

  // Create users (50 customers and 2 admins)
  const adminPassword = await hash("admin123", 10);
  const customerPassword = await hash("customer123", 10);

  // Create admin users
  await prisma.user.create({
    data: {
      email: "admin@example.com",
      password: adminPassword,
      firstName: "Admin",
      lastName: "User",
      phone: "+213 555 9876",
      role: UserRole.ADMIN,
      createdAt: randomDateWithinPastYear(),
      updatedAt: new Date(),
    },
  });

  await prisma.user.create({
    data: {
      email: "manager@example.com",
      password: adminPassword,
      firstName: "Store",
      lastName: "Manager",
      phone: "+213 555 8765",
      role: UserRole.ADMIN,
      createdAt: randomDateWithinPastYear(),
      updatedAt: new Date(),
    },
  });

  // Create customer users
  const userCount = 50;
  const users: User[] = [];

  for (let i = 0; i < userCount; i++) {
    const createdAt = randomDateWithinPastYear();
    const user = await prisma.user.create({
      data: {
        email: faker.internet.email(),
        password: customerPassword,
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        phone: faker.phone.number(),
        role: UserRole.CUSTOMER,
        createdAt,
        updatedAt: getUpdateDate(createdAt),
      },
    });
    users.push(user);
  }

  console.log(
    `Created ${userCount + 2} users (${userCount} customers and 2 admins)`
  );

  // Create addresses for users
  for (const user of users) {
    // Each user gets 1-3 addresses
    const addressCount = randomInt(1, 3);
    for (let i = 0; i < addressCount; i++) {
      const createdAt = randomDateWithinPastYear();
      await prisma.address.create({
        data: {
          name: faker.person.fullName(),
          street: faker.location.streetAddress(),
          city: randomElement([
            "Algiers",
            "Oran",
            "Constantine",
            "Annaba",
            "Batna",
            "Sétif",
            "Djelfa",
            "Sidi Bel Abbès",
          ]),
          state: randomElement([
            "Algiers",
            "Oran",
            "Constantine",
            "Annaba",
            "Batna",
            "Sétif",
            "Djelfa",
            "Sidi Bel Abbès",
          ]),
          postalCode: faker.location.zipCode(),
          country: "Algeria",
          isDefault: i === 0, // First address is default
          userId: user.id,
          createdAt,
          updatedAt: getUpdateDate(createdAt),
        },
      });
    }
  }

  console.log(`Created addresses for ${users.length} users`);

  // Create products
  const sizesByCategory = {
    Dresses: ["XS", "S", "M", "L", "XL"],
    Shirts: ["XS", "S", "M", "L", "XL", "XXL"],
    Pants: ["28", "30", "32", "34", "36", "38", "40"],
    Jackets: ["S", "M", "L", "XL", "XXL"],
    Accessories: ["One Size"],
    Shoes: ["36", "37", "38", "39", "40", "41", "42", "43", "44", "45"],
    Sportswear: ["XS", "S", "M", "L", "XL"],
    "Formal Wear": ["XS", "S", "M", "L", "XL", "XXL"],
  };

  const products: Product[] = [];
  const productCount = 50;

  // Function to create product description
  const createProductDescription = (name: string, category: string) => {
    const qualityWords = [
      "Premium",
      "High-quality",
      "Luxurious",
      "Comfortable",
      "Stylish",
      "Elegant",
      "Durable",
    ];
    const materialWords = [
      "cotton",
      "linen",
      "silk",
      "wool",
      "polyester",
      "leather",
      "suede",
      "denim",
    ];
    const usageWords = [
      "casual",
      "formal",
      "everyday",
      "special occasion",
      "outdoor",
      "indoor",
      "workout",
    ];

    return `${randomElement(
      qualityWords
    )} ${category.toLowerCase()} made from ${randomElement(
      materialWords
    )}. Perfect for ${randomElement(
      usageWords
    )} wear. ${faker.commerce.productDescription()}`;
  };

  for (let i = 0; i < productCount; i++) {
    const categoryName = randomElement(categories).name;
    const productName = `${faker.commerce.productAdjective()} ${categoryName.slice(
      0,
      -1
    )}`;
    const price = randomFloat(10, 150, 2);
    const hasDiscount = Math.random() > 0.7; // 30% chance of having a discount
    const salePrice = hasDiscount ? price * (1 - randomFloat(0.1, 0.5)) : null;
    const createdAt = randomDateWithinPastYear();

    // Create main image
    const ACCESS_KEY =
      "z8y8tejR1ru4btbQj9RdUiH4bWKCC8rrdZUOQl8uFn6V8Y30gQV6g2ws";

    async function getRandomImage(category:string, width=800, height=600) {
      const response = await fetch(
        `https://api.pexels.com/v1/search?query=${category}&per_page=1`,
        {
          headers: { Authorization: `${ACCESS_KEY}` },
        }
      );
      const data = await response.json();
      if (data.photos?.length > 0) {
        const imageUrl = data.photos[0].src.original;
        return `${imageUrl}?w=${width}&h=${height}`;
      }

      throw new Error("No images found");
    }

    const mainImage = await prisma.image.create({
      data: {
        url: await getRandomImage(categoryName.toLowerCase()),
        public_id: `product_main_${i}_${Date.now()}`,
      },
    });

    // Create product
    const product = await prisma.product.create({
      data: {
        name: productName,
        description: createProductDescription(productName, categoryName),
        price,
        salePrice,
        categoryName,
        mainImageId: mainImage.id,
        status: Math.random() > 0.1 ? "active" : "inactive", // 10% chance of being inactive
        inStock: Math.random() > 0.15, // 15% chance of being out of stock
        inNew: createdAt > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // New if created in the last 30 days
        isFeatured: Math.random() > 0.8, // 20% chance of being featured
        rating: randomFloat(3, 5, 1),
        reviewCount: randomInt(0, 50),
        createdAt,
        updatedAt: getUpdateDate(createdAt),
      },
    });

    products.push(product);

    // Create additional images (1-4 more images)
    const additionalImagesCount = randomInt(1, 4);
    for (let j = 0; j < additionalImagesCount; j++) {
      await prisma.image.create({
        data: {
          url: await getRandomImage(categoryName.toLocaleLowerCase()),
          public_id: `product_${i}_${j}_${Date.now()}`,
          productId: product.id,
        },
      });
    }

    // Create product variants
    const productColors = randomElements(colors, randomInt(1, 5));
    const productSizes: string[] =
      sizesByCategory[categoryName as keyof typeof sizesByCategory];

    for (const color of productColors) {
      for (const size of productSizes) {
        await prisma.productVariant.create({
          data: {
            productId: product.id,
            colorId: color.id,
            size,
            quantity: randomInt(0, 100),
          },
        });
      }
    }
  }

  console.log(`Created ${productCount} products with variants and images`);

  // Create carts for users (80% of users have a cart)
  const cartUsers = users.filter(() => Math.random() > 0.2);
  const carts: Cart[] = [];

  for (const user of cartUsers) {
    const cart = await prisma.cart.create({
      data: {
        userId: user.id,
        createdAt: randomDateWithinPastYear(),
        updatedAt: new Date(),
      },
    });
    carts.push(cart);
  }

  console.log(`Created ${carts.length} carts`);

  // Create cart items
  for (const cart of carts) {
    // Each cart has 1-5 items
    const itemCount = randomInt(1, 5);
    const cartProducts = randomElements(products, itemCount);

    for (const product of cartProducts) {
      const variants = await prisma.productVariant.findMany({
        where: { productId: product.id },
      });

      if (variants.length > 0) {
        const variant = randomElement(variants);
        await prisma.cartItem.create({
          data: {
            cartId: cart.id,
            variantId: variant.id,
            quantity: randomInt(1, 5),
          },
        });
      }
    }
  }

  console.log(`Added items to ${carts.length} carts`);
  type OrderItemWithVariant = OrderItem & {
    variant: {
      id: string;
      productId: string;
      colorId: string;
      size: string;
      quantity: number;
    };
  };
  // Create orders
  // Some orders will be from registered users, others will be guest orders
  const orderCount = 500;
  const allVariants = await prisma.productVariant.findMany();
  const allAddresses = await prisma.address.findMany();

  for (let i = 0; i < orderCount; i++) {
    const isGuest = Math.random() > 0.7; // 30% chance of being a guest order
    const orderItemsCount = randomInt(1, 8);
    const orderVariants = randomElements(allVariants, orderItemsCount);
    const createdAt = randomDateWithinPastYear();
    const daysSinceCreation = Math.floor(
      (new Date().getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24)
    );

    // Determine order status based on creation date
    let status;
    if (daysSinceCreation < 2) {
      status = OrderStatus.PENDING;
    } else if (daysSinceCreation < 5) {
      status = OrderStatus.PROCESSING;
    } else if (daysSinceCreation < 10) {
      status = OrderStatus.SHIPPED;
    } else {
      // For older orders, mostly delivered with some cancelled
      status =
        Math.random() > 0.1 ? OrderStatus.DELIVERED : OrderStatus.CANCELLED;
    }

    // Select a payment method
    const paymentMethod = randomElement([
      PaymentMethod.CREDIT,
      PaymentMethod.PAYPAL,
      PaymentMethod.GOOGLEPAY,
      PaymentMethod.APPLEPAY,
      PaymentMethod.COD,
    ]);

    // Calculate total by adding up all order items
    let total = 0;

    const orderItems: Partial<OrderItemWithVariant>[] = [];

    for (const variant of orderVariants) {
      const product = await prisma.product.findUnique({
        where: { id: variant.productId },
      });

      if (product) {
        const quantity = randomInt(1, 3);
        const itemPrice = product.salePrice ?? product.price;
        total += parseFloat(itemPrice.toString()) * quantity;

        orderItems.push({
          variant,
          quantity,
        });
      }
    }

    // Create order
    let userId: string | null = null;
    let shippingAddressId: string | null = null;
    let guestFirstName: string | null = null;
    let guestLastName: string | null = null;
    let guestPhone: string | null = null;
    let guestEmail: string | null = null;

    if (isGuest) {
      // Guest order
      guestFirstName = faker.person.firstName();
      guestLastName = faker.person.lastName();
      guestPhone = faker.phone.number();
      guestEmail = faker.internet.email();

      // Create a new address for the guest
      const guestAddress = await prisma.address.create({
        data: {
          name: `${guestFirstName} ${guestLastName}`,
          street: faker.location.streetAddress(),
          city: randomElement([
            "Algiers",
            "Oran",
            "Constantine",
            "Annaba",
            "Batna",
            "Sétif",
          ]),
          state: randomElement([
            "Algiers",
            "Oran",
            "Constantine",
            "Annaba",
            "Batna",
            "Sétif",
          ]),
          postalCode: faker.location.zipCode(),
          country: "Algeria",
          isDefault: true,
          createdAt,
          updatedAt: getUpdateDate(createdAt),
        },
      });

      shippingAddressId = guestAddress.id;
    } else {
      // Registered user order
      const user = randomElement(users);
      userId = user.id;

      // Find an address for this user
      const userAddresses = await prisma.address.findMany({
        where: { userId: user.id },
      });

      if (userAddresses.length > 0) {
        const address = randomElement(userAddresses);
        shippingAddressId = address.id;
      } else {
        // Create an address if none exists
        const newAddress = await prisma.address.create({
          data: {
            name: `${user.firstName} ${user.lastName}`,
            street: faker.location.streetAddress(),
            city: randomElement([
              "Algiers",
              "Oran",
              "Constantine",
              "Annaba",
              "Batna",
              "Sétif",
            ]),
            state: randomElement([
              "Algiers",
              "Oran",
              "Constantine",
              "Annaba",
              "Batna",
              "Sétif",
            ]),
            postalCode: faker.location.zipCode(),
            country: "Algeria",
            isDefault: true,
            userId: user.id,
            createdAt,
            updatedAt: getUpdateDate(createdAt),
          },
        });

        shippingAddressId = newAddress.id;
      }
    }

    // Create the order
    let orderData: any = {
      isGuest,
      total,
      paymentMethod,
      status,
      shippingAddressId,
      createdAt,
      updatedAt: getUpdateDate(createdAt),
    };

    // Add payment details if credit card
    if (paymentMethod === PaymentMethod.CREDIT) {
      orderData = {
        ...orderData,
        cardNumber: "XXXX-XXXX-XXXX-" + randomInt(1000, 9999),
        cardName: faker.person.fullName(),
        expiryDate: `${randomInt(1, 12)}/${randomInt(25, 30)}`,
        cvv: "XXX",
      };
    }

    // Add notes randomly
    if (Math.random() > 0.7) {
      orderData.notes = faker.lorem.sentence();
    }

    // Add user or guest info
    if (isGuest) {
      orderData = {
        ...orderData,
        guestFirstName,
        guestLastName,
        guestPhone,
        guestEmail,
      };
    } else {
      orderData = {
        ...orderData,
        userId,
      };
    }

    const order = await prisma.order.create({
      data: orderData,
    });

    // Create order items
    for (const item of orderItems) {
      await prisma.orderItem.create({
        data: {
          orderId: order.id,
          variantId: item.variant?.id || "",
          quantity: item.quantity || 1,
        },
      });
    }

    // Log progress periodically
    if (i % 50 === 0) {
      console.log(`Created ${i} orders out of ${orderCount}`);
    }
  }

  console.log(`Created ${orderCount} orders`);

  // Create seasonal patterns in product sales
  console.log("Creating seasonal order patterns...");

  // Define seasonal products
  const seasonalCategories = {
    spring: ["Dresses", "Shirts"],
    summer: ["Shirts", "Sportswear", "Accessories"],
    fall: ["Jackets", "Pants", "Formal Wear"],
    winter: ["Jackets", "Formal Wear", "Shoes"],
  };

  // Add 100 more orders with seasonal patterns
  const oneYearAgo = new Date(now);
  oneYearAgo.setFullYear(now.getFullYear() - 1);

  for (let i = 0; i < 100; i++) {
    // Determine season based on month
    const randomMonth = randomInt(0, 11);
    const orderDate = new Date(oneYearAgo);
    orderDate.setMonth(randomMonth);

    let seasonalCategoryNames;
    if (randomMonth >= 2 && randomMonth <= 4) {
      // Spring (March-May)
      seasonalCategoryNames = seasonalCategories.spring;
    } else if (randomMonth >= 5 && randomMonth <= 7) {
      // Summer (June-August)
      seasonalCategoryNames = seasonalCategories.summer;
    } else if (randomMonth >= 8 && randomMonth <= 10) {
      // Fall (September-November)
      seasonalCategoryNames = seasonalCategories.fall;
    } else {
      // Winter (December-February)
      seasonalCategoryNames = seasonalCategories.winter;
    }

    // Get products from seasonal categories
    const seasonalProducts = await prisma.product.findMany({
      where: {
        categoryName: {
          in: seasonalCategoryNames,
        },
      },
    });

    if (seasonalProducts.length === 0) continue;

    // Create a seasonal order
    const isGuest = Math.random() > 0.7;
    const orderItemsCount = randomInt(1, 4);
    const selectedProducts = randomElements(seasonalProducts, orderItemsCount);

    // Get variants for these products
    let total = 0;
    const orderItems: Partial<OrderItemWithVariant>[] = [];

    for (const product of selectedProducts) {
      const variants = await prisma.productVariant.findMany({
        where: { productId: product.id },
      });

      if (variants.length > 0) {
        const variant = randomElement(variants);
        const quantity = randomInt(1, 3);
        const itemPrice = product.salePrice ?? product.price;
        total += parseFloat(itemPrice.toString()) * quantity;

        orderItems.push({
          variant,
          quantity,
        });
      }
    }

    if (orderItems.length === 0) continue;

    // Determine order status based on date
    const daysSinceCreation = Math.floor(
      (new Date().getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    let status;
    if (daysSinceCreation < 2) {
      status = OrderStatus.PENDING;
    } else if (daysSinceCreation < 5) {
      status = OrderStatus.PROCESSING;
    } else if (daysSinceCreation < 10) {
      status = OrderStatus.SHIPPED;
    } else {
      status =
        Math.random() > 0.1 ? OrderStatus.DELIVERED : OrderStatus.CANCELLED;
    }

    // Similar logic as before for creating the order
    let userId: string | null = null;
    let shippingAddressId: string | null = null;
    let guestFirstName: string | null = null;
    let guestLastName: string | null = null;
    let guestPhone: string | null = null;
    let guestEmail: string | null = null;

    if (isGuest) {
      guestFirstName = faker.person.firstName();
      guestLastName = faker.person.lastName();
      guestPhone = faker.phone.number();
      guestEmail = faker.internet.email();

      const guestAddress = await prisma.address.create({
        data: {
          name: `${guestFirstName} ${guestLastName}`,
          street: faker.location.streetAddress(),
          city: randomElement([
            "Algiers",
            "Oran",
            "Constantine",
            "Annaba",
            "Batna",
            "Sétif",
          ]),
          state: randomElement([
            "Algiers",
            "Oran",
            "Constantine",
            "Annaba",
            "Batna",
            "Sétif",
          ]),
          postalCode: faker.location.zipCode(),
          country: "Algeria",
          isDefault: true,
          createdAt: orderDate,
          updatedAt: getUpdateDate(orderDate),
        },
      });

      shippingAddressId = guestAddress.id;
    } else {
      const user = randomElement(users);
      userId = user.id;

      const userAddresses = await prisma.address.findMany({
        where: { userId: user.id },
      });

      if (userAddresses.length > 0) {
        const address = randomElement(userAddresses);
        shippingAddressId = address.id;
      } else {
        const newAddress = await prisma.address.create({
          data: {
            name: `${user.firstName} ${user.lastName}`,
            street: faker.location.streetAddress(),
            city: randomElement([
              "Algiers",
              "Oran",
              "Constantine",
              "Annaba",
              "Batna",
              "Sétif",
            ]),
            state: randomElement([
              "Algiers",
              "Oran",
              "Constantine",
              "Annaba",
              "Batna",
              "Sétif",
            ]),
            postalCode: faker.location.zipCode(),
            country: "Algeria",
            isDefault: true,
            userId: user.id,
            createdAt: orderDate,
            updatedAt: getUpdateDate(orderDate),
          },
        });

        shippingAddressId = newAddress.id;
      }
    }

    // Create the order with seasonal date
    const paymentMethod = randomElement([
      PaymentMethod.CREDIT,
      PaymentMethod.PAYPAL,
      PaymentMethod.GOOGLEPAY,
      PaymentMethod.APPLEPAY,
      PaymentMethod.COD,
    ]);

    let orderData: any = {
      isGuest,
      total,
      paymentMethod,
      status,
      shippingAddressId,
      createdAt: orderDate,
      updatedAt: getUpdateDate(orderDate),
    };

    if (paymentMethod === PaymentMethod.CREDIT) {
      orderData = {
        ...orderData,
        cardNumber: "XXXX-XXXX-XXXX-" + randomInt(1000, 9999),
        cardName: faker.person.fullName(),
        expiryDate: `${randomInt(1, 12)}/${randomInt(25, 30)}`,
        cvv: "XXX",
      };
    }

    if (Math.random() > 0.7) {
      orderData.notes = faker.lorem.sentence();
    }

    if (isGuest) {
      orderData = {
        ...orderData,
        guestFirstName,
        guestLastName,
        guestPhone,
        guestEmail,
      };
    } else {
      orderData = {
        ...orderData,
        userId,
      };
    }

    const seasonalOrder = await prisma.order.create({
      data: orderData,
    });

    // Create order items
    for (const item of orderItems) {
      await prisma.orderItem.create({
        data: {
          orderId: seasonalOrder.id,
          variantId: item.variant?.id || "",
          quantity: item.quantity || 1,
        },
      });
    }
  }

  console.log("Created 100 additional seasonal orders");

  // Create some special product trends (holiday sales, etc.)
  console.log("Creating holiday sales patterns...");

  // Define holiday dates
  const holidays = [
    { name: "Eid al-Fitr", month: 3, day: 10 }, // Example date (changes yearly)
    { name: "Eid al-Adha", month: 6, day: 17 }, // Example date (changes yearly)
    { name: "Independence Day", month: 7, day: 5 },
    { name: "New Year", month: 0, day: 1 },
    { name: "Valentine's Day", month: 1, day: 14 },
  ];

  for (const holiday of holidays) {
    const holidayDate = new Date(
      new Date().getFullYear(),
      holiday.month,
      holiday.day
    );

    // Create 10 orders around each holiday (within 5 days before)
    for (let i = 0; i < 10; i++) {
      const orderDate = new Date(holidayDate);
      orderDate.setDate(orderDate.getDate() - randomInt(0, 5));

      // For holidays, create larger orders
      const orderItemsCount = randomInt(3, 8);
      const holidayProducts = randomElements(products, orderItemsCount);

      // Rest of order creation logic similar to seasonal orders
      // But with higher totals and more items per order

      const isGuest = Math.random() > 0.5; // More registered users during holidays
      let total = 0;
      const orderItems: Partial<OrderItemWithVariant>[] = [];

      for (const product of holidayProducts) {
        const variants = await prisma.productVariant.findMany({
          where: { productId: product.id },
        });

        if (variants.length > 0) {
          const variant = randomElement(variants);
          const quantity = randomInt(1, 5); // Higher quantities during holidays
          const itemPrice = product.salePrice ?? product.price;
          total += parseFloat(itemPrice.toString()) * quantity;

          orderItems.push({
            variant,
            quantity,
          });
        }
      }

      if (orderItems.length === 0) continue;

      // Most holiday orders are delivered by now
      const status =
        Math.random() > 0.05 ? OrderStatus.DELIVERED : OrderStatus.CANCELLED;

      // Similar logic for creating the order
      let userId: string | null = null;
      let shippingAddressId: string | null = null;
      let guestFirstName: string | null = null;
      let guestLastName: string | null = null;
      let guestPhone: string | null = null;
      let guestEmail: string | null = null;

      if (isGuest) {
        guestFirstName = faker.person.firstName();
        guestLastName = faker.person.lastName();
        guestPhone = faker.phone.number();
        guestEmail = faker.internet.email();

        const guestAddress = await prisma.address.create({
          data: {
            name: `${guestFirstName} ${guestLastName}`,
            street: faker.location.streetAddress(),
            city: randomElement([
              "Algiers",
              "Oran",
              "Constantine",
              "Annaba",
              "Batna",
              "Sétif",
            ]),
            state: randomElement([
              "Algiers",
              "Oran",
              "Constantine",
              "Annaba",
              "Batna",
              "Sétif",
            ]),
            postalCode: faker.location.zipCode(),
            country: "Algeria",
            isDefault: true,
            createdAt: orderDate,
            updatedAt: getUpdateDate(orderDate),
          },
        });

        shippingAddressId = guestAddress.id;
      } else {
        const user = randomElement(users);
        userId = user.id;

        const userAddresses = await prisma.address.findMany({
          where: { userId: user.id },
        });

        if (userAddresses.length > 0) {
          const address = randomElement(userAddresses);
          shippingAddressId = address.id;
        } else {
          const newAddress = await prisma.address.create({
            data: {
              name: `${user.firstName} ${user.lastName}`,
              street: faker.location.streetAddress(),
              city: randomElement([
                "Algiers",
                "Oran",
                "Constantine",
                "Annaba",
                "Batna",
                "Sétif",
              ]),
              state: randomElement([
                "Algiers",
                "Oran",
                "Constantine",
                "Annaba",
                "Batna",
                "Sétif",
              ]),
              postalCode: faker.location.zipCode(),
              country: "Algeria",
              isDefault: true,
              userId: user.id,
              createdAt: orderDate,
              updatedAt: getUpdateDate(orderDate),
            },
          });

          shippingAddressId = newAddress.id;
        }
      }

      // Create the holiday order
      const paymentMethod = randomElement([
        PaymentMethod.CREDIT,
        PaymentMethod.PAYPAL,
        PaymentMethod.GOOGLEPAY,
        PaymentMethod.APPLEPAY,
        PaymentMethod.COD,
      ]);

      let orderData: any = {
        isGuest,
        total,
        paymentMethod,
        status,
        shippingAddressId,
        createdAt: orderDate,
        updatedAt: getUpdateDate(orderDate),
        notes: `${holiday.name} order`,
      };

      if (paymentMethod === PaymentMethod.CREDIT) {
        orderData = {
          ...orderData,
          cardNumber: "XXXX-XXXX-XXXX-" + randomInt(1000, 9999),
          cardName: faker.person.fullName(),
          expiryDate: `${randomInt(1, 12)}/${randomInt(25, 30)}`,
          cvv: "XXX",
        };
      }

      if (isGuest) {
        orderData = {
          ...orderData,
          guestFirstName,
          guestLastName,
          guestPhone,
          guestEmail,
        };
      } else {
        orderData = {
          ...orderData,
          userId,
        };
      }

      const holidayOrder = await prisma.order.create({
        data: orderData,
      });

      // Create order items
      for (const item of orderItems) {
        await prisma.orderItem.create({
          data: {
            orderId: holidayOrder.id,
            variantId: item.variant?.id || "",
            quantity: item.quantity || 1,
          },
        });
      }
    }
  }

  console.log("Created holiday orders");

  // Create growth trend in user registrations
  console.log("Creating growth trend in user registrations...");

  // Add more users with increasing frequency in recent months
  const growthUserCount = 100;

  for (let i = 0; i < growthUserCount; i++) {
    // Bias towards more recent dates for user registration to show growth
    const monthsAgo = Math.floor(Math.pow(Math.random(), 2) * 12); // Square to bias towards recent months
    const registrationDate = new Date(now);
    registrationDate.setMonth(now.getMonth() - monthsAgo);

    const user = await prisma.user.create({
      data: {
        email: faker.internet.email(),
        password: customerPassword,
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        phone: faker.phone.number(),
        role: UserRole.CUSTOMER,
        createdAt: registrationDate,
        updatedAt: getUpdateDate(registrationDate),
      },
    });

    // Create address for user
    await prisma.address.create({
      data: {
        name: `${user.firstName} ${user.lastName}`,
        street: faker.location.streetAddress(),
        city: randomElement([
          "Algiers",
          "Oran",
          "Constantine",
          "Annaba",
          "Batna",
          "Sétif",
        ]),
        state: randomElement([
          "Algiers",
          "Oran",
          "Constantine",
          "Annaba",
          "Batna",
          "Sétif",
        ]),
        postalCode: faker.location.zipCode(),
        country: "Algeria",
        isDefault: true,
        userId: user.id,
        createdAt: registrationDate,
        updatedAt: getUpdateDate(registrationDate),
      },
    });

    // Create cart for some users
    if (Math.random() > 0.3) {
      const cart = await prisma.cart.create({
        data: {
          userId: user.id,
          createdAt: registrationDate,
          updatedAt: new Date(),
        },
      });

      // Add items to cart
      const itemCount = randomInt(1, 4);
      const cartProducts = randomElements(products, itemCount);

      for (const product of cartProducts) {
        const variants = await prisma.productVariant.findMany({
          where: { productId: product.id },
        });

        if (variants.length > 0) {
          const variant = randomElement(variants);
          await prisma.cartItem.create({
            data: {
              cartId: cart.id,
              variantId: variant.id,
              quantity: randomInt(1, 3),
            },
          });
        }
      }
    }

    // Some of these newer users have placed orders
    if (monthsAgo < 3 && Math.random() > 0.6) {
      const orderDate = new Date(registrationDate);
      orderDate.setDate(orderDate.getDate() + randomInt(1, 30)); // Order within a month of registration

      const userAddresses = await prisma.address.findMany({
        where: { userId: user.id },
      });

      if (userAddresses.length > 0) {
        const address = randomElement(userAddresses);

        // Create an order for this new user
        const orderItemsCount = randomInt(1, 5);
        const orderProducts = randomElements(products, orderItemsCount);

        let total = 0;
        const orderItems: Partial<OrderItemWithVariant>[] = [];

        for (const product of orderProducts) {
          const variants = await prisma.productVariant.findMany({
            where: { productId: product.id },
          });

          if (variants.length > 0) {
            const variant = randomElement(variants);
            const quantity = randomInt(1, 3);
            const itemPrice = product.salePrice ?? product.price;
            total += parseFloat(itemPrice.toString()) * quantity;

            orderItems.push({
              variant,
              quantity,
            });
          }
        }

        if (orderItems.length > 0) {
          // Recent orders are more likely to be in earlier stages
          const daysSinceOrder = Math.floor(
            (now.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24)
          );

          let status;
          if (daysSinceOrder < 2) {
            status = OrderStatus.PENDING;
          } else if (daysSinceOrder < 5) {
            status = OrderStatus.PROCESSING;
          } else if (daysSinceOrder < 10) {
            status = OrderStatus.SHIPPED;
          } else {
            status =
              Math.random() > 0.1
                ? OrderStatus.DELIVERED
                : OrderStatus.CANCELLED;
          }

          const paymentMethod = randomElement([
            PaymentMethod.CREDIT,
            PaymentMethod.PAYPAL,
            PaymentMethod.GOOGLEPAY,
            PaymentMethod.APPLEPAY,
            PaymentMethod.COD,
          ]);

          let orderData: any = {
            isGuest: false,
            userId: user.id,
            total,
            paymentMethod,
            status,
            shippingAddressId: address.id,
            createdAt: orderDate,
            updatedAt: getUpdateDate(orderDate),
          };

          if (paymentMethod === PaymentMethod.CREDIT) {
            orderData = {
              ...orderData,
              cardNumber: "XXXX-XXXX-XXXX-" + randomInt(1000, 9999),
              cardName: `${user.firstName} ${user.lastName}`,
              expiryDate: `${randomInt(1, 12)}/${randomInt(25, 30)}`,
              cvv: "XXX",
            };
          }

          const order = await prisma.order.create({
            data: orderData,
          });

          // Create order items
          for (const item of orderItems) {
            await prisma.orderItem.create({
              data: {
                orderId: order.id,
                variantId: item.variant?.id || "",
                quantity: item.quantity || 1,
              },
            });
          }
        }
      }
    }
  }

  console.log(`Created ${growthUserCount} additional users with growth trend`);

  console.log("Database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
