import { Request, Response } from "express";
import { createCategory, getAllCategories } from "../services/category/category.service";
import { successResponse, errorResponse } from "../utils/response.util";

export const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const category = await createCategory(req.body.name);

    const { response, statusCode } = successResponse(
      "Category created successfully",
      category,
      201
    );

    res.status(statusCode).json(response);
  } catch (error: any) {
    const { response, statusCode } = errorResponse(
      error.message || "Failed to create category",
      null,
      400
    );

    res.status(statusCode).json(response);
  }
};

export const getAll = async (_req: Request, res: Response): Promise<void> => {
  try {
    const categories = await getAllCategories();

    const { response, statusCode } = successResponse(
      "Categories retrieved successfully",
      categories,
      200
    );

    res.status(statusCode).json(response);
  } catch (error: any) {
    const { response, statusCode } = errorResponse(
      error.message || "Failed to retrieve categories",
      null,
      500
    );

    res.status(statusCode).json(response);
  }
};
