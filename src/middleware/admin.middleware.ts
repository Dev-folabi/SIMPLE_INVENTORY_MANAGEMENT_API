import { Request, Response, NextFunction } from "express";
import { errorResponse } from "../utils/response.util";

export const adminMiddleware = (
    req: Request,
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
