import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ✅ 1. Get all products
export const getAllProducts = async (req: Request, res: Response) => {
    try {
        const products = await prisma.product.findMany();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: "Error fetching products" });
    }
};

// ✅ 2. Get a single product by ID
export const getProductById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const product = await prisma.product.findUnique({ where: { id } });

        if (!product) {
            res.status(404).json({ message: "Product not found" });
            return;
        }

        res.json(product);
    } catch (error) {
        res.status(500).json({ message: "Error fetching product" });
    }
};

// ✅ 3. Create a new product (Admin only)
export const createProduct = async (req: Request, res: Response) => {
    const { name, description, price, category, sizes, colors, imageUrl, images, inStock, inNew, inSale, quantity } = req.body;

    try {
        const newProduct = await prisma.product.create({
            data: {
                name,
                description,
                price,
                category,
                sizes,
                colors,
                imageUrl,
                images,
                inStock,
                inNew,
                inSale,
                quantity,
            },
        });

        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ message: "Error creating product" });
    }
};

// ✅ 4. Update a product (Admin only)
export const updateProduct = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, description, price, category, sizes, colors, imageUrl, images, inStock, inNew, inSale, quantity } = req.body;

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
                category,
                sizes,
                colors,
                imageUrl,
                images,
                inStock,
                inNew,
                inSale,
                quantity,
            },
        });

        res.json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: "Error updating product" });
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
        res.json({ message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting product" });
    }
};
