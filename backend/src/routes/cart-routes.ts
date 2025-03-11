import express from "express";
import {
    getCart,
    addToCart,
    removeCartItem,
} from "../controllers/cart-controllers";
import { requireAuth } from "../middlewares/auth-middleware";

const router = express.Router();

router.get("/", requireAuth, getCart);
router.post("/", requireAuth, addToCart);
router.delete("/items/:variantId", requireAuth, removeCartItem);

export default router;
