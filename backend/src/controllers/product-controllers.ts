import { Request, RequestHandler, Response } from "express";
import { Color, Prisma, PrismaClient } from "@prisma/client";

import { v2 as cloudinary } from "cloudinary";
import { Decimal } from "@prisma/client/runtime/library";

const prisma = new PrismaClient();
// ✅ 1. Get all products

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const {
      categoryName,
      minPrice,
      maxPrice,
      search,
      status,
      sizes,
      colors,
      sortBy,
      sortOrder,
      page = "1",
      limit = "10",
    } = req.query;

    // Build base filters for Product fields
    const filters: Prisma.ProductWhereInput = {};

    if (categoryName && categoryName !== "all") {
      filters.categoryName = String(categoryName);
    }

    if (minPrice || maxPrice) {
      filters.price = {};
      if (minPrice) {
        filters.price.gte = new Decimal(String(minPrice));
      }
      if (maxPrice) {
        filters.price.lte = new Decimal(String(maxPrice));
      }
    }

    if (search) {
      filters.OR = [
        { name: { contains: String(search), mode: "insensitive" } },
        { description: { contains: String(search), mode: "insensitive" } },
      ];
    }

    if (status && status !== "all") {
      filters.status = String(status);
    }

    // Build filters for variants based on sizes and colors
    const variantFilters: Prisma.ProductVariantWhereInput[] = [];

    if (sizes) {
      const sizesArr = String(sizes)
        .split(",")
        .map((s) => s.trim());
      variantFilters.push({
        size: { in: sizesArr },
      });
    }

    if (colors) {
      // Colors are sent as "White|#FFFFFF,Green|#008000"
      const colorsArr = String(colors)
        .split(",")
        .map((item) => {
          const [name, hex] = item.split("|");
          return { name: name.trim(), hex: hex.trim() };
        });
      variantFilters.push({
        color: {
          OR: colorsArr.map((color) => ({
            name: color.name,
            hex: color.hex,
          })),
        },
      });
    }

    // Combine variant filters – if both sizes and colors are provided, require both conditions
    if (variantFilters.length === 1) {
      filters.variants = { some: variantFilters[0] };
    } else if (variantFilters.length === 2) {
      filters.AND = [
        { variants: { some: variantFilters[0] } },
        { variants: { some: variantFilters[1] } },
      ];
    }

    // Handle pagination
    const pageNumber = parseInt(String(page)) || 1;
    const limitNumber = parseInt(String(limit)) || 10;
    const skip = (pageNumber - 1) * limitNumber;

    const sortField = sortBy ? String(sortBy) : "createdAt";
    const order: Prisma.SortOrder =
      sortOrder && String(sortOrder).toLowerCase() === "desc" ? "desc" : "asc";

    // For sort fields other than "quantity", we can apply ordering directly.
    let orderBy: Prisma.ProductOrderByWithRelationInput | undefined = {};
    if (sortField !== "quantity") {
      orderBy = { [sortField]: order };
    }
    // For "quantity", since ordering by aggregated sum might not be available,
    // we'll sort in-memory after computing the aggregated quantity.

    const products = await prisma.product.findMany({
      where: filters,
      orderBy: orderBy,
      skip,
      take: limitNumber,
      include: {
        variants: {
          include: {
            color: true,
          },
        },
        category: true,
        images: true,
        mainImage: true,
      },
    });

    // Compute aggregated quantity (sum of all variant quantities) for each product
    let productsWithQuantity = products.map((product) => ({
      ...product,
      quantity: product.variants.reduce(
        (sum, variant) => sum + variant.quantity,
        0
      ),
    }));

    // If sorting by aggregated quantity, sort in-memory.
    if (sortField === "quantity") {
      productsWithQuantity.sort((a, b) =>
        order === "asc" ? a.quantity - b.quantity : b.quantity - a.quantity
      );
    }

    const total = await prisma.product.count({
      where: filters,
    });

    res.json({
      status: true,
      message: "featured products fetched successfully",
      products: productsWithQuantity,
      total,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching products" });
  }
};
// ✅ 2. Get featured products
export const getFeaturedProducts = async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      where: {
        isFeatured: true,
      },
      take: 4,
      include: {
        category: true,
        mainImage: true,
        images: true,
        variants: {
          include: {
            color: true,
          },
        },
      },
    });
    res.json({
      status: true,
      message: "featured products fetched successfully",
      products,
    });
  } catch (error) {
    res.status(500).json({ status: false, message: "Error fetching products" });
  }
};

// ✅ 3. Get a colors an sizes
export const getFilters = async (req: Request, res: Response) => {
  try {
    const colors = await prisma.color.findMany();
    const sizes = await prisma.productVariant.findMany({
      select: {
        size: true,
      },
      distinct: ["size"],
    });

    const sizesValues = sizes?.map((s) => s.size);

    res.json({
      status: true,
      message: "filters fetched successfully",
      colors,
      sizes: sizesValues,
    });
  } catch (error) {
    res.status(500).json({ status: false, message: "Error fetching filters" });
  }
};

// ✅ 3. Get a single product by ID
export const getProductById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        mainImage: true,
        images: true,
        variants: {
          include: {
            color: true,
          },
        },
      },
    });

    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }
    res.json({
      status: true,
      message: "product fetched successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({ status: false, message: "Error fetching product" });
  }
};

// Update the interface for the request with files
interface FileRequest extends Request {
  files?: Express.Multer.File[]; // Correct type for multer files
}
export const createProduct: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const { name, description, price, category, inStock, variants } = req.body;

  console.log(req.body);

  try {
    // Ensure mainImage is provided
    if (!req.body.mainImage) {
      res
        .status(400)
        .json({ status: false, message: "Main image is required" });
      return;
    }

    // Extract main image
    const mainImage = {
      url: req.body.mainImage.url,
      public_id: req.body.mainImage.public_id,
    };

    const images = req.body.images
      ? Array.isArray(req.body.images) // Check if it's already an array
        ? req.body.images.map((img: any) => ({
            url: img.url,
            public_id: img.public_id,
          }))
        : [{ url: req.body.images.url, public_id: req.body.images.public_id }] // Wrap single object in array
      : [];

    // Parse variants if provided
    const parsedVariants = variants ? JSON.parse(variants) : [];

    // Create product in Prisma
    const newProduct = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        category: {
          connect: {
            name: category,
          },
        },
        mainImage: {
          create: mainImage, // Store main image in DB
        },
        images: {
          createMany: {
            data: images, // Store additional images
          },
        },
        inStock,
        variants: {
          create: parsedVariants?.map(
            (variant: {
              color: { id: string; name: string; hex: string };
              size: string;
              quantity: number;
            }) => ({
              colorId: variant.color.id,
              size: variant.size,
              quantity: variant.quantity,
            })
          ),
        },
      },
      include: {
        category: true,
        mainImage: true,
        images: true,
        variants: {
          include: {
            color: true,
          },
        },
      },
    });

    res.status(201).json({
      status: true,
      message: "Product created successfully",
      newProduct,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: "Error creating product" });
  }
};
export const updateProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    name,
    description,
    price,
    category,
    oldImages,
    status,
    inStock,
    inNew,
    isFeatured,
    variants,
  } = req.body;

  try {
    // Fetch the existing product
    const existingProduct = await prisma.product.findUnique({
      where: { id },
      include: { mainImage: true, images: true },
    });

    if (!existingProduct) {
      res.status(404).json({ message: "Product not found" });
      return;
    }

    // **1️⃣ Handle Main Image Update**
    let newMainImage = null;
    if (req.body.mainImage) {
      newMainImage = {
        url: req.body.mainImage.url,
        public_id: req.body.mainImage.public_id,
      };
    }

    // **2️⃣ Process Newly Uploaded Images**

    console.log(req.body.newImages);
    const newImages = req.body.newImages
      ? Array.isArray(req.body.newImages) // Check if it's already an array
        ? req.body.newImages.map((img: any) => ({
            url: img.url,
            public_id: img.public_id,
          }))
        : [
            {
              url: req.body.newImages.url,
              public_id: req.body.newImages.public_id,
            },
          ] // Wrap single object in array
      : [];

    // **3️⃣ Handle Image Deletions**
    const parsedOldImages = oldImages
      ? Array.isArray(oldImages)
        ? oldImages.map((img: string) => JSON.parse(img)) // Parse each item
        : [JSON.parse(oldImages)] // Wrap single item in array
      : [];

    const existingImages = existingProduct.images || [];
    const imagesToDelete = existingImages.filter(
      (img) => !parsedOldImages.some((oldImg) => oldImg.url === img.url)
    );

    for (const img of imagesToDelete) {
      console.log(img);
      await cloudinary.uploader.destroy(img.public_id);
      await prisma.image.delete({ where: { id: img.id } });
    }

    // **4️⃣ Save New Images in Prisma**
    if (newImages.length > 0) {
      await prisma.image.createMany({ data: newImages });
    }

    const parsedVariants = variants
      ? Array.isArray(JSON.parse(variants))
        ? JSON.parse(variants)
        : [JSON.parse(variants)] // Wrap single item in array
      : [];
    // **6️⃣ Update Product in Prisma**

    console.log(newImages);
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name,
        description,
        price: parseFloat(price),
        category: {
          connect: {
            name: category,
          },
        },
        status,
        inStock,
        inNew,
        isFeatured,
        updatedAt: new Date(),
        images: {
          create: newImages,
        },
        mainImage: newMainImage ? { create: newMainImage } : undefined,
        variants: {
          deleteMany: {}, // Clear existing variants before updating
          create: parsedVariants.map(
            (variant: {
              color: { id: string };
              size: string;
              quantity: number;
            }) => ({
              colorId: variant.color.id,
              size: variant.size,
              quantity: variant.quantity,
            })
          ),
        },
      },
      include: {
        category: true,
        mainImage: true,
        images: true,
        variants: { include: { color: true } },
      },
    });
    if (req.body.mainImage) {
      // Delete old main image from Cloudinary if it exists and is different
      await cloudinary.uploader.destroy(existingProduct.mainImage.public_id);
      await prisma.image.delete({
        where: { id: existingProduct.mainImage.id },
      });
    }
    res.status(200).json({
      status: true,
      message: "Product updated successfully",
      updatedProduct,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: "Error updating product" });
  }
};

// ✅ 5. Delete a product (Admin only)
export const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const existingProduct = await prisma.product.findUnique({ where: { id } });

    if (!existingProduct) {
      res.status(404).json({ message: "Product not found" });
      return;
    }

    await prisma.product.delete({ where: { id } });
    res.json({ status: true, message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ status: false, message: "Error deleting product" });
  }
};

export const getTopProducts = async (req: Request, res: Response) => {
  try {
    const topProducts = await prisma.$queryRaw<
      { name: string; sales: number; revenue: number }[]
    >`
  SELECT 
    p."name",
    COALESCE(SUM(oi."quantity")::int, 0) AS sales,
    COALESCE(SUM(oi."quantity" * COALESCE(p."salePrice", p."price"))::numeric, 0) AS revenue
  FROM "OrderItem" oi
  JOIN "ProductVariant" pv ON oi."variantId" = pv."id"
  JOIN "Product" p ON pv."productId" = p."id"
  JOIN "Order" o ON oi."orderId" = o."id"
  WHERE o."status" = 'DELIVERED'
  GROUP BY p."name"
  ORDER BY sales DESC
  LIMIT 5;
`;

    // Convert BigInt to number if needed
    const formattedProducts = topProducts.map((product) => ({
      name: product.name,
      sales: Number(product.sales),
      revenue: Number(product.revenue),
    }));

    res.json(formattedProducts);
  } catch (error) {
    console.error("Error fetching top products:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
