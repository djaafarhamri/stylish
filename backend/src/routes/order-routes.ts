import express from "express";
import { createOrder, getOrders, getOrderById, updateOrderStatus, deleteOrder, createGuestOrder } from "../controllers/order-controllers";
import { isAdmin, isAuthenticated } from "../middlewares/auth-middleware";

const router = express.Router();

// Customer Routes
router.post("/", isAuthenticated, createOrder); // Place an order
router.post("/guest", createGuestOrder); // Place an order
router.get("/", isAuthenticated, getOrders); // Get user orders
router.get("/:id", isAuthenticated, getOrderById); // Get order details

// Admin Routes
router.patch("/:id/status", isAuthenticated, isAdmin, updateOrderStatus); // Update order status
router.delete("/:id", isAuthenticated, isAdmin, deleteOrder); // Delete an order

export default router;
