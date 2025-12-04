import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { successResponse, errorResponse } from '../utils/response.util';

const authService = new AuthService();

export class AuthController {
  async register(req: Request, res: Response): Promise<void> {
    try {
      const result = await authService.register(req.body);

      const { response, statusCode } = successResponse(
        'Registration successful',
        result,
        201
      );

      res.status(statusCode).json(response);
    } catch (error: any) {
      const { response, statusCode } = errorResponse(
        error.message || 'Registration failed',
        null,
        400
      );

      res.status(statusCode).json(response);
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const result = await authService.login(req.body);

      const { response, statusCode } = successResponse(
        'Login successful',
        result,
        200
      );

      res.status(statusCode).json(response);
    } catch (error: any) {
      const { response, statusCode } = errorResponse(
        error.message || 'Login failed',
        null,
        401
      );

      res.status(statusCode).json(response);
    }
  }

  async logout(_req: Request, res: Response): Promise<void> {
    const { response, statusCode } = successResponse(
      'Logged out successfully',
      null,
      200
    );

    res.status(statusCode).json(response);
  }
}
