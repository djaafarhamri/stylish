import express from "express";
import { 
    getAllProducts, 
    getProductById, 
    createProduct, 
    updateProduct, 
    deleteProduct 
} from "../controllers/productController";
import { isAdmin, isAuthenticated } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.post("/", isAuthenticated, isAdmin, createProduct);
router.put("/:id", isAuthenticated, isAdmin, updateProduct);
router.delete("/:id", isAuthenticated, isAdmin, deleteProduct);

export default router;
