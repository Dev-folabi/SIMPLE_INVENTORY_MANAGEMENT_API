import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger.util";
import { AuthRequest } from "../types";

/**
 * Middleware to log HTTP requests
 */
export const loggerMiddleware = (
  req: Request | AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const startTime = Date.now();

  // Log when response finishes
  res.on("finish", () => {
    const duration = Date.now() - startTime;
    const user = (req as AuthRequest).user;

    const logData = {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get("user-agent"),
      userId: user?.id || "anonymous",
    };

    // Choose log level based on status code
    if (res.statusCode >= 500) {
      logger.error("HTTP Request", logData);
    } else if (res.statusCode >= 400) {
      logger.warn("HTTP Request", logData);
    } else {
      logger.http("HTTP Request", logData);
    }
  });

  next();
};
