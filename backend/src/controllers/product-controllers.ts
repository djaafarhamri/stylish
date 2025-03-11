import { Request, Response } from "express";
import { PrismaClient, Size } from "@prisma/client";

const prisma = new PrismaClient();
// ✅ 1. Get all products
export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const {
      category,
      minPrice,
      maxPrice,
      search,
      sortBy = "createdAt",
      sortOrder = "desc",
      page = 1,
      limit = 10,
      sizes,
      colors, // Expecting "White|#FFFFFF,Green|#008000"
    } = req.query;

    const filters: any = {};

    if (category) filters.categoryName = category;
    if (minPrice) filters.price = { gte: Number(minPrice) };
    if (maxPrice) filters.price = { ...filters.price, lte: Number(maxPrice) };
    if (search) filters.name = { contains: search, mode: "insensitive" };

    const variantFilters: any = {};

    // ✅ Filter by sizes
    if (sizes) {
      const sizeArray = (sizes as string).split(",");
      variantFilters.size = { in: sizeArray };
    }

    // ✅ Filter by colors
    if (colors) {
      const colorArray = (colors as string).split(",").map((c) => {
        const [name, hex] = c.split("|");
        return { name, hex };
      });

      variantFilters.color = {
        OR: colorArray.map(({ name, hex }) => ({
          AND: [{ name }, { hex }],
        })),
      };
    }

    // ✅ Apply variant filters if any exist
    if (Object.keys(variantFilters).length > 0) {
      filters.variants = { some: variantFilters };
    }

    const totalCount = await prisma.product.count({ where: filters });

    const products = await prisma.product.findMany({
      where: filters,
      orderBy: { [sortBy as string]: sortOrder },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
      include: {
        category: true,
        variants: {
          include: {
            color: true,
          },
        },
      },
    });

    res.json({
      status: true,
      message: "Products fetched successfully",
      products,
      total: totalCount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: "Error fetching products" });
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
    const sizes = Object.values(Size);

    res.json({
      status: true,
      message: "filters fetched successfully",
      colors,
      sizes,
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

// ✅ 4. Create a new product (Admin only)
export const createProduct = async (req: Request, res: Response) => {
  const {
    name,
    description,
    price,
    categoryName,
    imageUrl,
    images,
    inStock,
    inNew,
    isFeatured,
    variants,
  } = req.body;

  try {
    const newProduct = await prisma.product.create({
      data: {
        name,
        description,
        price,
        categoryName, // Ensure categoryId is correctly referenced
        imageUrl,
        images,
        inStock,
        inNew,
        isFeatured,
        variants: {
          create: variants.map(
            (variant: { colorId: string; size: Size; quantity: number }) => ({
              colorId: variant.colorId,
              size: variant.size,
              quantity: variant.quantity,
            })
          ),
        },
      },
      include: {
        category: true,
        variants: {
          include: {
            color: true,
          },
        },
      },
    });
    res.status(201).json({
      status: true,
      message: "product created successfully",
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
    categoryName,
    imageUrl,
    images,
    inStock,
    inNew,
    isFeatured,
    variants,
  } = req.body;

  try {
    const existingProduct = await prisma.product.findUnique({ where: { id } });

    if (!existingProduct) {
      res.status(404).json({ message: "Product not found" });
      return;
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name,
        description,
        price,
        categoryName: categoryName,
        imageUrl,
        images,
        inStock,
        inNew,
        isFeatured,
        updatedAt: new Date(),
        variants: {
          deleteMany: {}, // Clear existing variants before updating
          create: variants.map(
            (variant: { colorId: string; size: Size; quantity: number }) => ({
              colorId: variant.colorId,
              size: variant.size,
              quantity: variant.quantity,
            })
          ),
        },
      },
      include: {
        category: true,
        variants: {
          include: {
            color: true,
          },
        },
      },
    });

    res.status(201).json({
      status: true,
      message: "product updated successfully",
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
