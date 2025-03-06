import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ✅ 1. Get all categories
export const getAllCategories = async (req: Request, res: Response) => {
    try {
        const categories = await prisma.category.findMany();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: "Error fetching categories" });
    }
};

// ✅ 2. Get a single category by ID
export const getCategoryById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const category = await prisma.category.findUnique({ where: { id } });

        if (!category) {
            res.status(404).json({ message: "Category not found" });
            return;
        }

        res.json(category);
    } catch (error) {
        res.status(500).json({ message: "Error fetching category" });
    }
};

// ✅ 3. Create a new category (Admin only)
export const createCategory = async (req: Request, res: Response) => {
    const { name } = req.body;

    try {
        const existingCategory = await prisma.category.findUnique({ where: { name } });

        if (existingCategory) {
            res.status(400).json({ message: "Category name already exists" });
            return;
        }

        const newCategory = await prisma.category.create({
            data: { name },
        });

        res.status(201).json(newCategory);
    } catch (error) {
        res.status(500).json({ message: "Error creating category" });
    }
};

// ✅ 4. Update a category (Admin only)
export const updateCategory = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name } = req.body;

    try {
        const existingCategory = await prisma.category.findUnique({ where: { id } });

        if (!existingCategory) {
            res.status(404).json({ message: "Category not found" });
            return;
        }

        const updatedCategory = await prisma.category.update({
            where: { id },
            data: { name },
        });

        res.json(updatedCategory);
    } catch (error) {
        res.status(500).json({ message: "Error updating category" });
    }
};

// ✅ 5. Delete a category (Admin only)
export const deleteCategory = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const existingCategory = await prisma.category.findUnique({ where: { id } });

        if (!existingCategory) {
            res.status(404).json({ message: "Category not found" });
            return;
        }

        await prisma.category.delete({ where: { id } });
        res.json({ message: "Category deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting category" });
    }
};
