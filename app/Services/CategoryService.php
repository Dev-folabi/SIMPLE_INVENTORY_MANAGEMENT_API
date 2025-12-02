<?php

namespace App\Services;

use App\Models\Category;
use Illuminate\Database\Eloquent\Collection;

class CategoryService
{
    /**
     * Get all categories
     */
    public function getAllCategories(): Collection
    {
        return Category::orderBy('name', 'asc')->get();
    }

    /**
     * Create a new category
     */
    public function createCategory(array $data): Category
    {
        return Category::create([
            'name' => $data['name'],
            // Slug is auto-generated in the model
        ]);
    }

    /**
     * Find category by ID
     */
    public function findById(int $id): ?Category
    {
        return Category::find($id);
    }
}
