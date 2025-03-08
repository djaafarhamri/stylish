import express from "express";
import { 
    getAllProducts, 
    getProductById, 
    createProduct, 
    updateProduct, 
    deleteProduct, 
    getFeaturedProducts,
    getFilters
} from "../controllers/product-controllers";
import { isAdmin, isAuthenticated } from "../middlewares/auth-middleware";

const router = express.Router();

router.get("/", getAllProducts);
router.get("/featured", getFeaturedProducts);
router.get("/filters", getFilters);
router.get("/:id", getProductById);
router.post("/", isAuthenticated, isAdmin, createProduct);
router.put("/:id", isAuthenticated, isAdmin, updateProduct);
router.delete("/:id", isAuthenticated, isAdmin, deleteProduct);

export default router;
