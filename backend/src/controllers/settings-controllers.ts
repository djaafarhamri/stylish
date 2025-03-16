import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ✅ 1. Get all categories
export const getStore = async (req: Request, res: Response) => {
  try {
    const store = await prisma.store.findFirst();
    res.json(store);
  } catch (error) {
    res.status(500).json({ message: "Error fetching categories" });
  }
};

// ✅ 1. Get all categories
export const setStore = async (req: Request, res: Response) => {
  const { id, name, email, phone, currency, address, description } = req.body;
  
  console.log(req.body)
  try {
    const store = await prisma.store.update({
      where: {
        id,
      },
      data: {
        name,
        email,
        phone,
        currency,
        address,
        description,
      },
    });
    res.json(store);
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Error setting store information" });
  }
};

// ✅ 1. Get all categories
export const getSEO = async (req: Request, res: Response) => {
  try {
    const seo = await prisma.sEO.findFirst();
    res.json(seo);
  } catch (error) {
    res.status(500).json({ message: "Error fetching categories" });
  }
};

// ✅ 1. Get all categories
export const setSEO = async (req: Request, res: Response) => {
  const { id, title, description, keywords } = req.body;

  try {
    const seo = await prisma.sEO.update({
      where: {
        id,
      },
      data: {
        id,
        title,
        description,
        keywords,
      },
    });
    res.json(seo);
  } catch (error) {
    res.status(500).json({ message: "Error fetching categories" });
  }
};

// ✅ 1. Get all categories
export const getShipping = async (req: Request, res: Response) => {
  try {
    const shipping = await prisma.shipping.findFirst();
    res.json(shipping);
  } catch (error) {
    res.status(500).json({ message: "Error fetching categories" });
  }
};

// ✅ 1. Get all categories
export const setShipping = async (req: Request, res: Response) => {
  const { id, free, threshold, express, fee } = req.body;

  try {
    const shipping = await prisma.shipping.update({
      where: {
        id,
      },
      data: {
        id,
        free,
        threshold,
        express,
        fee,
      },
    });
    res.json(shipping);
  } catch (error) {
    res.status(500).json({ message: "Error fetching categories" });
  }
};

// ✅ 1. Get all categories
export const getPayment = async (req: Request, res: Response) => {
  try {
    const payment = await prisma.payment.findFirst();
    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: "Error fetching categories" });
  }
};

// ✅ 1. Get all categories
export const setPayment = async (req: Request, res: Response) => {
  const { id, credit, paypal, applepay, googlepay } = req.body;

  try {
    const payment = await prisma.payment.update({
      where: {
        id,
      },
      data: {
        id,
        credit,
        paypal,
        applepay,
        googlepay,
      },
    });
    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: "Error fetching categories" });
  }
};

// ✅ 1. Get all categories
export const getNotification = async (req: Request, res: Response) => {
  try {
    const notifications = await prisma.notifications.findFirst();
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Error fetching categories" });
  }
};

// ✅ 1. Get all categories
export const setNotification = async (req: Request, res: Response) => {
  const {
    id,
    orderConfirmation,
    shippingConfirmation,
    orderCancellation,
    abandonedCart,
  } = req.body;

  try {
    const notifications = await prisma.notifications.update({
      where: {
        id,
      },
      data: {
        id,
        orderConfirmation,
        shippingConfirmation,
        orderCancellation,
        abandonedCart,
      },
    });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Error fetching categories" });
  }
};
