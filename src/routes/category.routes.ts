import { Router } from "express";
import { getAll, create } from "../controllers/categoryController";
import { createCategoryValidator } from "../middleware/validators/category.validator";
import { authMiddleware } from "../middleware/auth.middleware";
import { adminMiddleware } from "../middleware/admin.middleware";

const router = Router();

// All routes require authentication
router.use(authMiddleware);

// Get all categories
router.get("/", getAll);

// Create category (admin only)
router.post("/", adminMiddleware, createCategoryValidator, create);

export default router;
