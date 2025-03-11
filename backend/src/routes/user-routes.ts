import express from "express";
import { register, login, getMe, updateProfile, changePassword, addAddress, updateAddress, deleteAddress, getAddress, getMyAddresses, logout, setDefaultAddress } from "../controllers/user-controllers";
import { requireAuth } from "../middlewares/auth-middleware";

const router = express.Router();

// Public routes
router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);

// Protected routes
router.get("/me", requireAuth, getMe);
router.put("/update-profile", requireAuth, updateProfile);
router.put("/change-password", requireAuth, changePassword);

router.post("/address", requireAuth, addAddress);
router.put("/address/:id", requireAuth, updateAddress);
router.get("/address/me", requireAuth, getMyAddresses);
router.get("/address/:id", getAddress);
router.get("/address/default/:id", requireAuth, setDefaultAddress);
router.delete("/address/:id", requireAuth, deleteAddress);


export default router;
