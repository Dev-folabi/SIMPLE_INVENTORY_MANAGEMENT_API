import { ApiResponse, PaginatedResponse, PaginationMeta } from "../types";

export const successResponse = <T>(
    message: string,
    data?: T,
    statusCode: number = 200
): { response: ApiResponse<T>; statusCode: number } => {
    return {
        response: {
            success: true,
            message,
            data,
        },
        statusCode,
    };
};

export const errorResponse = (
    message: string,
    errors?: any,
    statusCode: number = 400
): { response: ApiResponse; statusCode: number } => {
    return {
        response: {
            success: false,
            message,
            errors,
        },
        statusCode,
    };
};

export const paginatedResponse = <T>(
    message: string,
    data: T,
    meta: PaginationMeta,
    statusCode: number = 200
): { response: PaginatedResponse<T>; statusCode: number } => {
    return {
        response: {
            success: true,
            message,
            data,
            meta,
        },
        statusCode,
    };
};
