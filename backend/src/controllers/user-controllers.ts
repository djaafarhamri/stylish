import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

// Schema Validation
const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  phone: z.string().min(2),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

// Helper: Generate JWT
const generateToken = (userId: string) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET as string, {
    expiresIn: "7d",
  });
};

// Register User
export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName, phone } =
      registerSchema.parse(req.body);

    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(400).json({ message: "Email already in use" });
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: { email, password: hashedPassword, firstName, lastName, phone },
    });

    res.status(201).json({
      message: "User registered successfully",
      token: generateToken(user.id),
    });
  } catch (error) {
    res.status(400).json({ message: "Invalid input", error });
  }
};

// Login User
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    // Find user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }
    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }
    res.json({ token: generateToken(user.id) });
  } catch (error) {
    res.status(400).json({ message: "Invalid input", error });
  }
};

// Get Current User
export const getMe = async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
      },
    });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update Profile
export const updateProfile = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName } = req.body;

    const user = await prisma.user.update({
      where: { id: req.userId },
      data: { firstName, lastName },
    });

    res.json(user);
  } catch (error) {
    res.status(400).json({ message: "Could not update profile", error });
  }
};

// Change Password
export const changePassword = async (req: Request, res: Response) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const user = await prisma.user.findUnique({ where: { id: req.userId } });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    // Check old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      res.status(400).json({ message: "Incorrect old password" });
      return;
    }
    // Update password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: req.userId },
      data: { password: hashedPassword },
    });

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(400).json({ message: "Could not change password", error });
  }
};

// Update Profile
export const addAddress = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const { name, street, city, state, postalCode } = req.body;

    const address = await prisma.address.create({
      data: { name, street, city, state, postalCode, userId },
    });

    res.json(address);
  } catch (error) {
    res.status(400).json({ message: "Could not add address", error });
  }
};

// Update Profile
export const updateAddress = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { name, street, city, state, postalCode } = req.body;

    const address = await prisma.address.update({
      where: { id },
      data: { name, street, city, state, postalCode },
    });

    res.json(address);
  } catch (error) {
    res.status(400).json({ message: "Could not update address", error });
  }
};

// Update Profile
export const deleteAddress = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const address = await prisma.address.delete({
      where: { id },
    });

    res.json(address);
  } catch (error) {
    res.status(400).json({ message: "Could not delete address", error });
  }
};

// Update Profile
export const getMyAddresses = async (req: Request, res: Response) => {
  try {
    const addresses = await prisma.address.findMany({
      where: { userId: req.userId },
    });

    res.json(addresses);
  } catch (error) {
    res.status(400).json({ message: "Could not delete address", error });
  }
};

// Update Profile
export const getAddress = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const addresses = await prisma.address.findUnique({
      where: { id },
    });

    res.json(addresses);
  } catch (error) {
    res.status(400).json({ message: "Could not delete address", error });
  }
};
