import { body } from "express-validator";
import { validateRequest } from "../validator.middleware";

export const createProductValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Product name is required")
    .isLength({ min: 2 })
    .withMessage("Product name must be at least 2 characters"),

  body("description").optional().trim(),

  body("quantity")
    .notEmpty()
    .withMessage("Quantity is required")
    .isInt({ min: 0 })
    .withMessage("Quantity must be a non-negative integer"),

  body("price")
    .notEmpty()
    .withMessage("Price is required")
    .isFloat({ min: 0 })
    .withMessage("Price must be a non-negative number"),

  body("categoryId")
    .notEmpty()
    .withMessage("Category ID is required")
    .isInt({ min: 1 })
    .withMessage("Category ID must be a valid integer"),

  validateRequest,
];

export const updateProductValidator = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage("Product name must be at least 2 characters"),

  body("description").optional().trim(),

  body("quantity")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Quantity must be a non-negative integer"),

  body("price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Price must be a non-negative number"),

  body("categoryId")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Category ID must be a valid integer"),

  validateRequest,
];
