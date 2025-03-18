import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import redis from "../cache/redis";

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
      res.status(400).json({ status: false, message: "Email already in use" });
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: { email, password: hashedPassword, firstName, lastName, phone },
    });

    const token = generateToken(user.id);
    await redis.del("customers:*");

    res.cookie("access_token", token, {
      httpOnly: true, // Prevents JavaScript access
      secure: process.env.NODE_ENV === "production", // Only send over HTTPS in production
      sameSite: "none", // Prevent CSRF attacks
      maxAge: 60 * 60 * 1000, // 1 hour expiration
    });

    res.status(201).json({
      status: true,
      message: "User registered successfully",
      user,
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
      res.status(400).json({ status: false, message: "Invalid credentials" });
      return;
    }
    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ status: false, message: "Invalid credentials" });
      return;
    }
    const token = generateToken(user.id);
    res.cookie("access_token", token, {
      httpOnly: true,
      maxAge: 60 * 60 * 1000, // 1 hour
      sameSite: process.env.NODE_ENV === "production" ? "none" : undefined,
      secure: process.env.NODE_ENV === "production" ? true : false,
    });

    res.json({ status: true, message: "Login successful", user });
  } catch (error) {
    res.status(400).json({ message: "Invalid input", error });
  }
};

export const logout = async (req: Request, res: Response) => {
  res.clearCookie("access_token", {
    httpOnly: true,
  });

  res.status(200).json({ status: true, message: "Logged out successfully" });
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
        phone: true,
        role: true,
      },
    });
    if (!user) {
      res.status(404).json({ status: false, message: "User not found" });
      return;
    }
    res.json({ status: true, message: "User fetched successfully", user });
  } catch (error) {
    res.status(500).json({ status: false, message: "Server error" });
  }
};

// Update Profile
export const updateProfile = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, phone } = req.body;
    const user = await prisma.user.update({
      where: { id: req.userId },
      data: { firstName, lastName, email, phone },
    });
    await redis.del("customers:*");

    res.json({ status: true, message: "profile updated successfully", user });
  } catch (error) {
    res
      .status(400)
      .json({ status: false, message: "Could not update profile", error });
  }
};

// Change Password
export const changePassword = async (req: Request, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await prisma.user.findUnique({ where: { id: req.userId } });
    if (!user) {
      res.status(404).json({ status: false, message: "User not found" });
      return;
    }
    // Check old password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      res
        .status(400)
        .json({ status: false, message: "Incorrect current password" });
      return;
    }
    // Update password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: req.userId },
      data: { password: hashedPassword },
    });

    res.json({ status: true, message: "Password updated successfully" });
  } catch (error) {
    res
      .status(400)
      .json({ status: false, message: "Could not change password", error });
  }
};

// Update Profile
export const addAddress = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const { name, street, city, state, postalCode, country, isDefault } =
      req.body;

    const address = await prisma.address.create({
      data: {
        name,
        street,
        city,
        state,
        postalCode,
        country,
        userId,
        isDefault,
      },
    });

    if (isDefault) {
      await prisma.$transaction([
        prisma.address.updateMany({
          where: { userId: req.userId },
          data: { isDefault: false },
        }),
        prisma.address.update({
          where: { id: address.id },
          data: { isDefault: true },
        }),
      ]);
    }

    res.json({ status: true, message: "address added", address });
  } catch (error) {
    res
      .status(400)
      .json({ status: false, message: "Could not add address", error });
  }
};

// Update Profile
export const updateAddress = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, street, city, state, postalCode, country, isDefault } =
      req.body;
    if (isDefault) {
      await prisma.$transaction([
        prisma.address.updateMany({
          where: { userId: req.userId },
          data: { isDefault: false },
        }),
        prisma.address.update({
          where: { id },
          data: { isDefault: true },
        }),
      ]);
    }
    const address = await prisma.address.update({
      where: { id },
      data: { name, street, city, state, postalCode, country },
    });

    res.json({ status: true, message: "address updated", address });
  } catch (error) {
    res
      .status(400)
      .json({ status: false, message: "Could not update address", error });
  }
};

// Update Profile
export const deleteAddress = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const address = await prisma.address.findUnique({
      where: { id },
    });
    if (!address) {
      res.status(404).json({ status: false, message: "Address Not Found" });
      return;
    }
    if (address?.userId !== req.userId) {
      res.status(401).json({
        status: false,
        message: "unauthorized to delete this address",
      });
      return;
    }
    await prisma.address.delete({
      where: { id },
    });

    let nextAddress;
    if (address.isDefault) {
      nextAddress = await prisma.address.findFirst({
        where: { userId: req.userId },
        orderBy: { createdAt: "asc" }, // Get the oldest remaining address
      });

      // If there is another address, set it as the default
      if (nextAddress) {
        await prisma.address.update({
          where: { id: nextAddress.id },
          data: { isDefault: true },
        });
      }
    }

    res.json({
      status: true,
      message: "address deleted",
      default: nextAddress ? nextAddress.id : null,
    });
  } catch (error) {
    res
      .status(400)
      .json({ status: false, message: "Could not delete address", error });
  }
};

// Update Profile
export const getMyAddresses = async (req: Request, res: Response) => {
  try {
    const addresses = await prisma.address.findMany({
      where: { userId: req.userId },
      orderBy: {
        isDefault: "desc",
      },
    });

    res.json({
      status: true,
      message: "addresses fetched successfully",
      addresses,
    });
  } catch (error) {
    res.status(400).json({ message: "Could not delete address", error });
  }
};

// Update Profile
export const getAddress = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const address = await prisma.address.findUnique({
      where: { id },
    });

    res.json({
      status: true,
      message: "address fetched successfully",
      address,
    });
  } catch (error) {
    res.status(400).json({ message: "Could not delete address", error });
  }
};

export const setDefaultAddress = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.$transaction([
      prisma.address.updateMany({
        where: { userId: req.userId },
        data: { isDefault: false },
      }),
      prisma.address.update({
        where: { id },
        data: { isDefault: true },
      }),
    ]);
    res.json({
      status: true,
      message: "address fetched successfully",
    });
  } catch (error) {
    res.status(400).json({ message: "Could not delete address", error });
  }
};
