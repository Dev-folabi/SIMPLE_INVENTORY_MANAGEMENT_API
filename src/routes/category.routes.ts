import { Router } from "express";
import { CategoryController } from "../controllers/category.controller";
import { createCategoryValidator } from "../middleware/validators/category.validator";
import { authMiddleware } from "../middleware/auth.middleware";
import { adminMiddleware } from "../middleware/admin.middleware";

const router = Router();
const categoryController = new CategoryController();

// All routes require authentication
router.use(authMiddleware);

// Get all categories
router.get("/", categoryController.getAll);

// Create category (admin only)
router.post(
  "/",
  adminMiddleware,
  createCategoryValidator,
  categoryController.create
);

export default router;
