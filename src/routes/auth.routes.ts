import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import {
  registerValidator,
  loginValidator,
} from '../validators/auth.validator';
import { validateRequest } from '../middleware/validator.middleware';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
const authController = new AuthController();

// Public routes
router.post('/register', registerValidator, validateRequest, (req, res) =>
  authController.register(req, res)
);

router.post('/login', loginValidator, validateRequest, (req, res) =>
  authController.login(req, res)
);

// Protected routes
router.post('/logout', authMiddleware, (req, res) =>
  authController.logout(req, res)
);

export default router;
