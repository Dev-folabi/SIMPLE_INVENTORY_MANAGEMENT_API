<?php

namespace App\Services;

use App\Models\Product;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;

class ProductService
{
    /**
     * Get products with filters, search, sort, and pagination
     */
    public function getProducts(array $filters): LengthAwarePaginator
    {
        $query = Product::with('category');

        // Search by name (case-insensitive for PostgreSQL)
        if (!empty($filters['search'])) {
            $query->where('name', 'ILIKE', '%' . $filters['search'] . '%');
        }

        // Filter by category (ID or slug)
        if (!empty($filters['category'])) {
            // Check if it's numeric (ID) or string (slug)
            if (is_numeric($filters['category'])) {
                $query->where('category_id', $filters['category']);
            } else {
                $query->whereHas('category', function (Builder $subQ) use ($filters) {
                    $subQ->where('slug', $filters['category']);
                });
            }
        }

        // Sorting (allowlist approach)
        $allowedSortFields = ['name', 'price', 'quantity', 'created_at'];
        $sortField = $filters['sort'] ?? 'created_at';
        $sortOrder = $filters['order'] ?? 'desc';

        if (in_array($sortField, $allowedSortFields)) {
            $sortOrder = in_array(strtolower($sortOrder), ['asc', 'desc']) ? $sortOrder : 'desc';
            $query->orderBy($sortField, $sortOrder);
        }

        // Pagination
        $perPage = min((int)($filters['per_page'] ?? 15), 100); // Max 100 per page
        
        return $query->paginate($perPage);
    }

    /**
     * Create a new product
     */
    public function createProduct(array $data): Product
    {
        return Product::create($data);
    }

    /**
     * Find product by ID
     */
    public function getProductById(int $id): ?Product
    {
        return Product::with('category')->find($id);
    }

    /**
     * Update product
     */
    public function updateProduct(int $id, array $data): ?Product
    {
        $product = Product::find($id);
        
        if ($product) {
            $product->update($data);
            $product->load('category');
        }
        
        return $product;
    }

    /**
     * Delete product (soft delete)
     */
    public function deleteProduct(int $id): bool
    {
        $product = Product::find($id);
        
        if ($product) {
            return $product->delete();
        }
        
        return false;
    }
}
