import { PrismaClient } from "@prisma/client";
import { Response, NextFunction, Request } from "express";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();


export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.cookies)
    const token = req.cookies.access_token
    if (!token) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };
        req.userId = decoded.userId;
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }
};

export const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
    const user = await prisma.user.findUnique({ where: { id: req.userId } });

    if (!user || user.role !== "ADMIN") {
        res.status(403).json({ message: "Access denied. Admins only." });
        return;
    }

    next();
};
