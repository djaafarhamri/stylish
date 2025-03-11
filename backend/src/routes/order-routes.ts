import express from "express";
import { createOrder, getOrders, getOrderById, updateOrderStatus, deleteOrder, createGuestOrder } from "../controllers/order-controllers";
import { isAuthenticated, requireAdmin, requireAuth } from "../middlewares/auth-middleware";

const router = express.Router();

// Customer Routes
router.post("/", requireAuth, createOrder); // Place an order
router.post("/guest", createGuestOrder); // Place an order
router.get("/", requireAuth, getOrders); // Get user orders
router.get("/:id", isAuthenticated, getOrderById); // Get order details

// Admin Routes
router.patch("/:id/status", requireAuth, requireAdmin, updateOrderStatus); // Update order status
router.delete("/:id", requireAuth, requireAdmin, deleteOrder); // Delete an order

export default router;
