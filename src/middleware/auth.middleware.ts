import { Response, NextFunction } from "express";
import { AuthRequest } from "../types";
import prisma from "../prisma";
import { verifyToken } from "../utils/jwt.util";
import { errorResponse } from "../utils/response.util";

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      const { response, statusCode } = errorResponse(
        "No token provided",
        null,
        401
      );
      res.status(statusCode).json(response);
      return;
    }

    const token = authHeader.substring(7);

    try {
      // Check if token is blacklisted
      const { isTokenBlacklisted } = await import(
        "../services/auth/tokenBlacklist.service"
      );
      const blacklisted = await isTokenBlacklisted(token);

      if (blacklisted) {
        const { response, statusCode } = errorResponse(
          "Token has been invalidated",
          null,
          401
        );
        res.status(statusCode).json(response);
        return;
      }

      const decoded = verifyToken(token);

      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
      });

      if (!user) {
        const { response, statusCode } = errorResponse(
          "User not found",
          null,
          401
        );
        res.status(statusCode).json(response);
        return;
      }

      req.user = user;
      next();
    } catch (error) {
      const { response, statusCode } = errorResponse(
        "Invalid or expired token",
        null,
        401
      );
      res.status(statusCode).json(response);
      return;
    }
  } catch (error) {
    const { response, statusCode } = errorResponse(
      "Authentication failed",
      null,
      401
    );
    res.status(statusCode).json(response);
    return;
  }
};
