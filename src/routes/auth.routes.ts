import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import {
  registerValidator,
  loginValidator,
} from "../middleware/validators/auth.validator";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();
const authController = new AuthController();

// Public routes
router.post("/register", registerValidator, authController.register);

router.post("/login", loginValidator, authController.login);

// Protected routes
router.post("/logout", authMiddleware, authController.logout);

export default router;
