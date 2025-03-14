import express from "express";
import { createOrder, getOrders, getOrderById, updateOrderStatus, deleteOrder, createGuestOrder, getCustomers, getCustomerById } from "../controllers/order-controllers";
import { isAuthenticated, requireAdmin, requireAuth } from "../middlewares/auth-middleware";

const router = express.Router();

// Customer Routes
router.post("/", requireAuth, createOrder); // Place an order
router.post("/guest", createGuestOrder); // Place an order
router.get("/", requireAuth, getOrders); // Get user orders

// Admin Routes
router.get("/customers/:id", requireAuth, requireAdmin, getCustomerById); // Get order details
router.get("/customers", requireAuth, requireAdmin, getCustomers); // Get order details
router.get("/:id", isAuthenticated, getOrderById); // Get order details
router.patch("/:id/status", requireAuth, requireAdmin, updateOrderStatus); // Update order status
router.delete("/:id", requireAuth, requireAdmin, deleteOrder); // Delete an order

export default router;
