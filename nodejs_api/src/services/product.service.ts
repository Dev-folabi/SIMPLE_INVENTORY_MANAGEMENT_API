import { PrismaClient, Prisma } from "@prisma/client";
import { ProductFilters } from "../types";

const prisma = new PrismaClient();

const ALLOWED_SORT_FIELDS = ["name", "price", "quantity", "createdAt"];

export class ProductService {
    async getProducts(filters: ProductFilters) {
        const {
            search,
            category,
            sort = "createdAt",
            order = "desc",
            perPage = 15,
            page = 1,
        } = filters;

        // Build where clause
        const where: Prisma.ProductWhereInput = {
            deletedAt: null,
        };

        // Search by name (case-insensitive)
        if (search) {
            where.name = {
                contains: search,
                mode: "insensitive",
            };
        }

        // Filter by category
        if (category) {
            if (!isNaN(Number(category))) {
                // Filter by category ID
                where.categoryId = parseInt(category);
            } else {
                // Filter by category slug
                where.category = {
                    slug: category,
                };
            }
        }

        // Validate sort field
        const sortField = ALLOWED_SORT_FIELDS.includes(sort)
            ? sort
            : "createdAt";

        // Calculate pagination
        const limit = Math.min(perPage, 100);
        const skip = (page - 1) * limit;

        // Get total count
        const total = await prisma.product.count({ where });

        // Get products
        const products = await prisma.product.findMany({
            where,
            include: {
                category: true,
            },
            orderBy: {
                [sortField]: order,
            },
            take: limit,
            skip,
        });

        // Calculate pagination meta
        const lastPage = Math.ceil(total / limit);

        return {
            products,
            meta: {
                currentPage: page,
                from: skip + 1,
                lastPage,
                perPage: limit,
                to: skip + products.length,
                total,
            },
        };
    }

    async getProductById(id: number) {
        return await prisma.product.findFirst({
            where: {
                id,
                deletedAt: null,
            },
            include: {
                category: true,
            },
        });
    }

    async createProduct(data: {
        name: string;
        description?: string;
        quantity: number;
        price: number;
        categoryId: number;
    }) {
        // Verify category exists
        const category = await prisma.category.findUnique({
            where: { id: data.categoryId },
        });

        if (!category) {
            throw new Error("Category not found");
        }

        return await prisma.product.create({
            data: {
                name: data.name,
                description: data.description,
                quantity: data.quantity,
                price: data.price,
                categoryId: data.categoryId,
            },
            include: {
                category: true,
            },
        });
    }

    async updateProduct(
        id: number,
        data: {
            name?: string;
            description?: string;
            quantity?: number;
            price?: number;
            categoryId?: number;
        }
    ) {
        // Check if product exists
        const product = await this.getProductById(id);
        if (!product) {
            return null;
        }

        // If categoryId is provided, verify it exists
        if (data.categoryId) {
            const category = await prisma.category.findUnique({
                where: { id: data.categoryId },
            });

            if (!category) {
                throw new Error("Category not found");
            }
        }

        return await prisma.product.update({
            where: { id },
            data,
            include: {
                category: true,
            },
        });
    }

    async deleteProduct(id: number) {
        // Check if product exists
        const product = await this.getProductById(id);
        if (!product) {
            return false;
        }

        // Soft delete
        await prisma.product.update({
            where: { id },
            data: { deletedAt: new Date() },
        });

        return true;
    }
}
