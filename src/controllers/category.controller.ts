import { Request, Response } from "express";
import { CategoryService } from "../services/category.service";
import { successResponse, errorResponse } from "../utils/response.util";

const categoryService = new CategoryService();

export class CategoryController {
    async getAll(_req: Request, res: Response): Promise<void> {
        try {
            const categories = await categoryService.getAllCategories();

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
    }

    async create(req: Request, res: Response): Promise<void> {
        try {
            const category = await categoryService.createCategory(
                req.body.name
            );

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
    }
}
