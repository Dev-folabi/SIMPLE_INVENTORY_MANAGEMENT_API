import { body } from "express-validator";
import { validateRequest } from "../validator.middleware";

export const createCategoryValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Category name is required")
    .isLength({ min: 2 })
    .withMessage("Category name must be at least 2 characters"),

  validateRequest,
];
