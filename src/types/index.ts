import { User } from "@prisma/client";
import { Request } from "express";

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: any;
}

export interface AuthRequest extends Request {
  user?: User;
}

export interface PaginationMeta {
  currentPage: number;
  from: number | null;
  lastPage: number;
  perPage: number;
  to: number | null;
  total: number;
}

export interface PaginatedResponse<T> extends ApiResponse<T> {
  meta: PaginationMeta;
}

export interface JwtPayload {
  userId: number;
  email: string;
  role: string;
}

export interface ProductFilters {
  search?: string;
  category?: string;
  sort?: string;
  order?: "asc" | "desc";
  perPage?: number;
  page?: number;
}
