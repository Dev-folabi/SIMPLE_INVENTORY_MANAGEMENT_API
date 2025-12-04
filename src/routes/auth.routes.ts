import { Router } from "express";
import { register, login, logout } from "../controllers/authController";
import {
  registerValidator,
  loginValidator,
} from "../middleware/validators/auth.validator";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

// Public routes
router.post("/register", registerValidator, register);

router.post("/login", loginValidator, login);

// Protected routes
router.post("/logout", authMiddleware, logout);

export default router;
