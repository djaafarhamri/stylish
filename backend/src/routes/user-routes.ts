import express from "express";
import { register, login, getMe, updateProfile, changePassword, addAddress, updateAddress, deleteAddress, getAddress, getMyAddresses, logout } from "../controllers/user-controllers";
import { isAuthenticated } from "../middlewares/auth-middleware";

const router = express.Router();

// Public routes
router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);

// Protected routes
router.get("/me", isAuthenticated, getMe);
router.put("/update-profile", isAuthenticated, updateProfile);
router.put("/change-password", isAuthenticated, changePassword);

router.post("/address", isAuthenticated, addAddress);
router.put("/address/:id", isAuthenticated, updateAddress);
router.get("/address/me", isAuthenticated, getMyAddresses);
router.get("/address/:id", isAuthenticated, getAddress);
router.delete("/address/:id", isAuthenticated, deleteAddress);


export default router;
