import { Request, Response } from "express";
import { ProductService } from "../services/product.service";
import {
    successResponse,
    errorResponse,
    paginatedResponse,
} from "../utils/response.util";

const productService = new ProductService();

export class ProductController {
    async getAll(req: Request, res: Response): Promise<void> {
        try {
            const filters = {
                search: req.query.search as string,
                category: req.query.category as string,
                sort: req.query.sort as string,
                order: req.query.order as "asc" | "desc",
                perPage: req.query.per_page
                    ? parseInt(req.query.per_page as string)
                    : 15,
                page: req.query.page ? parseInt(req.query.page as string) : 1,
            };

            const { products, meta } = await productService.getProducts(
                filters
            );

            const { response, statusCode } = paginatedResponse(
                "Products retrieved successfully",
                products,
                meta,
                200
            );

            res.status(statusCode).json(response);
        } catch (error: any) {
            const { response, statusCode } = errorResponse(
                error.message || "Failed to retrieve products",
                null,
                500
            );

            res.status(statusCode).json(response);
        }
    }

    async getById(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            const product = await productService.getProductById(id);

            if (!product) {
                const { response, statusCode } = errorResponse(
                    "Product not found",
                    null,
                    404
                );

                res.status(statusCode).json(response);
                return;
            }

            const { response, statusCode } = successResponse(
                "Product retrieved successfully",
                product,
                200
            );

            res.status(statusCode).json(response);
        } catch (error: any) {
            const { response, statusCode } = errorResponse(
                error.message || "Failed to retrieve product",
                null,
                500
            );

            res.status(statusCode).json(response);
        }
    }

    async create(req: Request, res: Response): Promise<void> {
        try {
            const product = await productService.createProduct(req.body);

            const { response, statusCode } = successResponse(
                "Product created successfully",
                product,
                201
            );

            res.status(statusCode).json(response);
        } catch (error: any) {
            const { response, statusCode } = errorResponse(
                error.message || "Failed to create product",
                null,
                400
            );

            res.status(statusCode).json(response);
        }
    }

    async update(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            const product = await productService.updateProduct(id, req.body);

            if (!product) {
                const { response, statusCode } = errorResponse(
                    "Product not found",
                    null,
                    404
                );

                res.status(statusCode).json(response);
                return;
            }

            const { response, statusCode } = successResponse(
                "Product updated successfully",
                product,
                200
            );

            res.status(statusCode).json(response);
        } catch (error: any) {
            const { response, statusCode } = errorResponse(
                error.message || "Failed to update product",
                null,
                400
            );

            res.status(statusCode).json(response);
        }
    }

    async delete(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            const deleted = await productService.deleteProduct(id);

            if (!deleted) {
                const { response, statusCode } = errorResponse(
                    "Product not found",
                    null,
                    404
                );

                res.status(statusCode).json(response);
                return;
            }

            const { response, statusCode } = successResponse(
                "Product deleted successfully",
                null,
                200
            );

            res.status(statusCode).json(response);
        } catch (error: any) {
            const { response, statusCode } = errorResponse(
                error.message || "Failed to delete product",
                null,
                500
            );

            res.status(statusCode).json(response);
        }
    }
}
