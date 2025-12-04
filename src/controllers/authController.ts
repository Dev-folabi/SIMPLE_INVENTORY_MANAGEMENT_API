import { Request, Response } from "express";
import { loginUser, registerUser } from "../services/auth/auth.service";
import { errorResponse, successResponse } from "../utils/response.util";
import { AuthRequest } from "../types";

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await loginUser(req.body);

    const { response, statusCode } = successResponse(
      "Login successful",
      result,
      200
    );

    res.status(statusCode).json(response);
  } catch (error: any) {
    const { response, statusCode } = errorResponse(
      error.message || "Login failed",
      null,
      401
    );

    res.status(statusCode).json(response);
  }
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await registerUser(req.body);

    const { response, statusCode } = successResponse(
      "Registration successful",
      result,
      201
    );

    res.status(statusCode).json(response);
  } catch (error: any) {
    const { response, statusCode } = errorResponse(
      error.message || "Registration failed",
      null,
      400
    );

    res.status(statusCode).json(response);
  }
};

export const logout = async (
  req: AuthRequest,
  res: Response
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

    // Decode token to get expiration time
    const { decodeToken } = await import("../utils/jwt.util");
    const decoded = decodeToken(token);

    if (!decoded || !decoded.exp) {
      const { response, statusCode } = errorResponse(
        "Invalid token",
        null,
        400
      );
      res.status(statusCode).json(response);
      return;
    }

    // Add token to blacklist
    const { addTokenToBlacklist } = await import(
      "../services/auth/tokenBlacklist.service"
    );
    const expiresAt = new Date(decoded.exp * 1000); // Convert Unix timestamp to Date
    await addTokenToBlacklist(token, expiresAt);

    const { response, statusCode } = successResponse(
      "Logged out successfully",
      null,
      200
    );

    res.status(statusCode).json(response);
  } catch (error: any) {
    const { response, statusCode } = errorResponse(
      error.message || "Logout failed",
      null,
      500
    );

    res.status(statusCode).json(response);
  }
};
