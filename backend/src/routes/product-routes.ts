import express from "express";
import { 
    getAllProducts, 
    getProductById, 
    createProduct, 
    updateProduct, 
    deleteProduct, 
    getFeaturedProducts,
    getFilters,
    getTopProducts
} from "../controllers/product-controllers";
import { requireAdmin, requireAuth } from "../middlewares/auth-middleware";
import upload from "../middlewares/upload";

const router = express.Router();

router.get("/", getAllProducts);
router.get("/top", requireAuth, requireAdmin, getTopProducts);
router.get("/featured", getFeaturedProducts);
router.get("/filters", getFilters);
router.get("/:id", getProductById);
router.post("/", requireAuth, requireAdmin,
    upload.fields([{ name: "mainImage", maxCount: 1 }, { name: "images", maxCount: 5 }]), // Separate fields
     createProduct);
router.put("/:id", requireAuth, requireAdmin, 
    upload.fields([{ name: "mainImage", maxCount: 1 }, { name: "newImages", maxCount: 5 }]), // Separate fields
     updateProduct);
router.delete("/:id", requireAuth, requireAdmin, deleteProduct);

export default router;
