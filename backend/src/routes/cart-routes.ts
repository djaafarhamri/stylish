import express from "express";
import {
    getCart,
    addToCart,
    updateCartItem,
    removeCartItem,
    clearCart
} from "../controllers/cart-controllers";
import { isAuthenticated } from "../middlewares/auth-middleware";

const router = express.Router();

router.get("/", isAuthenticated, getCart);
router.post("/add", isAuthenticated, addToCart);
router.put("/update/:itemId", isAuthenticated, updateCartItem);
router.delete("/remove/:itemId", isAuthenticated, removeCartItem);
router.delete("/clear", isAuthenticated, clearCart);

export default router;
