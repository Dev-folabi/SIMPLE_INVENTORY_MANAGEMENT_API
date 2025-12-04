import { Router } from "express";
import { ProductController } from "../controllers/product.controller";
import {
  createProductValidator,
  updateProductValidator,
} from "../middleware/validators/product.validator";
import { authMiddleware } from "../middleware/auth.middleware";
import { adminMiddleware } from "../middleware/admin.middleware";

const router = Router();
const productController = new ProductController();

// All routes require authentication
router.use(authMiddleware);

// Get all products (with filters)
router.get("/", productController.getAll);

// Get single product
router.get("/:id", productController.getById);

// Create product (admin only)
router.post(
  "/",
  adminMiddleware,
  createProductValidator,
  productController.create
);

// Update product (admin only)
router.put(
  "/:id",
  adminMiddleware,
  updateProductValidator,
  productController.update
);

// Delete product (admin only)
router.delete("/:id", adminMiddleware, productController.delete);

export default router;
