import { Router } from "express";
import { ProductController } from "../controllers/product.controller";
import {
  createProductValidator,
  updateProductValidator,
} from "../middleware/validators/product.validator";
import { validateRequest } from "../middleware/validator.middleware";
import { authMiddleware } from "../middleware/auth.middleware";
import { adminMiddleware } from "../middleware/admin.middleware";

const router = Router();
const productController = new ProductController();

// All routes require authentication
router.use(authMiddleware);

// Get all products (with filters)
router.get("/", (req, res) => productController.getAll(req, res));

// Get single product
router.get("/:id", (req, res) => productController.getById(req, res));

// Create product (admin only)
router.post(
  "/",
  adminMiddleware,
  createProductValidator,
  validateRequest,
  (req, res) => productController.create(req, res)
);

// Update product (admin only)
router.put(
  "/:id",
  adminMiddleware,
  updateProductValidator,
  validateRequest,
  (req, res) => productController.update(req, res)
);

// Delete product (admin only)
router.delete("/:id", adminMiddleware, (req, res) =>
  productController.delete(req, res)
);

export default router;
