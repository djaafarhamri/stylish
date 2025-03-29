import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import productRoutes from "./routes/product-routes";
import categoryRoutes from "./routes/category-routes";
import userRoutes from "./routes/user-routes";
import cartRoutes from "./routes/cart-routes";
import orderRoutes from "./routes/order-routes";
import settingsRoutes from "./routes/settings-routes";
import cookieParser from "cookie-parser";
import path = require("path");

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use("*", (req: Request, res: Response, next: NextFunction) => {
  console.log("API CALL: ", req.method, req.originalUrl);
  next();
});

// Middleware
app.use(
  cors({
    credentials: true,
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      "https://stylish-admin.vercel.app",
      "https://www.stylish-admin.vercel.app",
      "https://stylish-six-tawny.vercel.app",
      "https://www.stylish-six-tawny.vercel.app",
      "https://stylish-server.vercel.app"
    ],
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/users", userRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/settings", settingsRoutes);

// Global error handler
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err.stack);
    res.status(500).json({
      status: "error",
      message: "Something went wrong!",
      error: process.env.NODE_ENV === "development" ? err.message : {},
    });
  }
);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
