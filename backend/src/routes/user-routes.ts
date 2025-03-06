import express from "express";
import { register, login, getMe, updateProfile, changePassword } from "../controllers/user-controllers";
import { authMiddleware } from "../middlewares/auth-middleware";

const router = express.Router();

// Public routes
router.post("/register", register);
router.post("/login", login);

// Protected routes
router.get("/me", authMiddleware, getMe);
router.put("/update-profile", authMiddleware, updateProfile);
router.put("/change-password", authMiddleware, changePassword);

export default router;
