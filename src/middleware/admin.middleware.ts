import { Response, NextFunction } from "express";
import { errorResponse } from "../utils/response.util";
import { AuthRequest } from "../types";


export const adminMiddleware = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): void => {
    if (!req.user) {
        const { response, statusCode } = errorResponse(
            "Unauthorized",
            null,
            401
        );
        res.status(statusCode).json(response);
        return;
    }

    if (req.user.role !== "admin") {
        const { response, statusCode } = errorResponse(
            "Forbidden. Admin access required.",
            null,
            403
        );
        res.status(statusCode).json(response);
        return;
    }

    next();
};
