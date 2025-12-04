import { Request, Response } from "express";
import { loginUser, registerUser } from "../services/auth/auth.service";
import { errorResponse, successResponse } from "../utils/response.util";

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

export const logout = async (_req: Request, res: Response): Promise<void> => {
  const { response, statusCode } = successResponse(
    "Logged out successfully",
    null,
    200
  );

  res.status(statusCode).json(response);
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
