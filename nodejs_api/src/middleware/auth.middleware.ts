import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import { verifyToken } from "../utils/jwt.util";
import { errorResponse } from "../utils/response.util";

const prisma = new PrismaClient();

export const authMiddleware = async (
    req: Request,
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
