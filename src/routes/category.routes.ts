import { Router } from 'express';
import { CategoryController } from '../controllers/category.controller';
import { createCategoryValidator } from '../validators/category.validator';
import { validateRequest } from '../middleware/validator.middleware';
import { authMiddleware } from '../middleware/auth.middleware';
import { adminMiddleware } from '../middleware/admin.middleware';

const router = Router();
const categoryController = new CategoryController();

// All routes require authentication
router.use(authMiddleware);

// Get all categories
router.get('/', (req, res) => categoryController.getAll(req, res));

// Create category (admin only)
router.post(
  '/',
  adminMiddleware,
  createCategoryValidator,
  validateRequest,
  (req, res) => categoryController.create(req, res)
);

export default router;
