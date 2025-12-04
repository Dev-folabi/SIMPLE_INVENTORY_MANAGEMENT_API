import { Request, Response } from "express";
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct,
} from "../services/product/product.service";
import {
  successResponse,
  errorResponse,
  paginatedResponse,
} from "../utils/response.util";

export const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await createProduct(req.body);

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
};

export const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const filters = {
      search: req.query.search as string,
      category: req.query.category as string,
      sort: req.query.sort as string,
      order: req.query.order as "asc" | "desc",
      perPage: req.query.per_page ? parseInt(req.query.per_page as string) : 15,
      page: req.query.page ? parseInt(req.query.page as string) : 1,
    };

    const { products, meta } = await getProducts(filters);

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
};

export const getById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    const product = await getProductById(id);

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
};

export const update = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    const updated = await updateProduct(id, req.body);

    if (!updated) {
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
      updated,
      200
    );

    res.status(statusCode).json(response);
  } catch (error: any) {
    const { response, statusCode } = errorResponse(
      error.message || "Failed to update product",
      null,
      500
    );

    res.status(statusCode).json(response);
  }
};

export const deleteProducts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    const deleted = await deleteProduct(id);

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
};
