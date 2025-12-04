import { Router } from "express";
import {
  getAll,
  getById,
  create,
  update,
  deleteProducts,
} from "../controllers/productController";
import {
  createProductValidator,
  updateProductValidator,
} from "../middleware/validators/product.validator";
import { authMiddleware } from "../middleware/auth.middleware";
import { adminMiddleware } from "../middleware/admin.middleware";

const router = Router();

// All routes require authentication
router.use(authMiddleware);

// Get all products (with filters)
router.get("/", getAll);

// Get single product
router.get("/:id", getById);

// Create product (admin only)
router.post("/", adminMiddleware, createProductValidator, create);

// Update product (admin only)
router.put("/:id", adminMiddleware, updateProductValidator, update);

// Delete product (admin only)
router.delete("/:id", adminMiddleware, deleteProducts);

export default router;
