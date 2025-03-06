import express from "express";
import { register, login, getMe, updateProfile, changePassword } from "../controllers/user-controllers";
import { isAuthenticated } from "../middlewares/auth-middleware";

const router = express.Router();

// Public routes
router.post("/register", register);
router.post("/login", login);

// Protected routes
router.get("/me", isAuthenticated, getMe);
router.put("/update-profile", isAuthenticated, updateProfile);
router.put("/change-password", isAuthenticated, changePassword);

export default router;
