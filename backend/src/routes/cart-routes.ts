import express from "express";
import {
    getCart,
    addToCart,
    removeCartItem,
} from "../controllers/cart-controllers";
import { isAuthenticated } from "../middlewares/auth-middleware";

const router = express.Router();

router.get("/", isAuthenticated, getCart);
router.post("/", isAuthenticated, addToCart);
router.delete("/items/:variantId", isAuthenticated, removeCartItem);

export default router;
