import { Request, Response, NextFunction } from "express";
import { errorResponse } from "../utils/response.util";
import logger from "../utils/logger.util";

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  logger.error("Error:", err);

  const { response, statusCode } = errorResponse(
    err.message || "Internal server error",
    process.env.NODE_ENV === "development" ? err.stack : undefined,
    500
  );

  res.status(statusCode).json(response);
};
