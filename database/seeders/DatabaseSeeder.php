<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create admin user
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@inventory.test',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);

        // Create regular user
        User::create([
            'name' => 'Regular User',
            'email' => 'user@inventory.test',
            'password' => Hash::make('password'),
            'role' => 'user',
        ]);

        // Create categories
        $categories = [
            ['name' => 'Electronics'],
            ['name' => 'Furniture'],
            ['name' => 'Clothing'],
            ['name' => 'Food & Beverages'],
            ['name' => 'Books'],
            ['name' => 'Sports Equipment'],
        ];

        foreach ($categories as $categoryData) {
            Category::create($categoryData);
        }

        // Create sample products
        $products = [
            [
                'name' => 'Laptop',
                'description' => 'High-performance gaming laptop with RTX 4070',
                'quantity' => 15,
                'price' => 1999.99,
                'category_id' => 1,
            ],
            [
                'name' => 'Wireless Mouse',
                'description' => 'Ergonomic wireless mouse with precision tracking',
                'quantity' => 50,
                'price' => 29.99,
                'category_id' => 1,
            ],
            [
                'name' => 'Office Chair',
                'description' => 'Comfortable ergonomic office chair with lumbar support',
                'quantity' => 20,
                'price' => 299.99,
                'category_id' => 2,
            ],
            [
                'name' => 'Standing Desk',
                'description' => 'Adjustable height standing desk',
                'quantity' => 10,
                'price' => 499.99,
                'category_id' => 2,
            ],
            [
                'name' => 'T-Shirt',
                'description' => 'Cotton casual t-shirt, multiple colors available',
                'quantity' => 100,
                'price' => 19.99,
                'category_id' => 3,
            ],
            [
                'name' => 'Jeans',
                'description' => 'Classic blue denim jeans',
                'quantity' => 75,
                'price' => 59.99,
                'category_id' => 3,
            ],
            [
                'name' => 'Coffee Beans',
                'description' => 'Premium arabica coffee beans, 1kg pack',
                'quantity' => 200,
                'price' => 24.99,
                'category_id' => 4,
            ],
            [
                'name' => 'Energy Drink',
                'description' => 'Sugar-free energy drink, 24-pack',
                'quantity' => 150,
                'price' => 39.99,
                'category_id' => 4,
            ],
            [
                'name' => 'Programming Book',
                'description' => 'Clean Code: A Handbook of Agile Software Craftsmanship',
                'quantity' => 30,
                'price' => 44.99,
                'category_id' => 5,
            ],
            [
                'name' => 'Fiction Novel',
                'description' => 'Bestselling fiction novel',
                'quantity' => 45,
                'price' => 14.99,
                'category_id' => 5,
            ],
            [
                'name' => 'Basketball',
                'description' => 'Official size basketball',
                'quantity' => 25,
                'price' => 34.99,
                'category_id' => 6,
            ],
            [
                'name' => 'Yoga Mat',
                'description' => 'Non-slip yoga mat with carrying strap',
                'quantity' => 40,
                'price' => 29.99,
                'category_id' => 6,
            ],
            [
                'name' => 'Smartphone',
                'description' => 'Latest flagship smartphone with 5G',
                'quantity' => 30,
                'price' => 899.99,
                'category_id' => 1,
            ],
            [
                'name' => 'Bookshelf',
                'description' => '5-tier wooden bookshelf',
                'quantity' => 12,
                'price' => 149.99,
                'category_id' => 2,
            ],
            [
                'name' => 'Running Shoes',
                'description' => 'Lightweight running shoes with cushioning',
                'quantity' => 60,
                'price' => 89.99,
                'category_id' => 6,
            ],
        ];

        foreach ($products as $productData) {
            Product::create($productData);
        }
    }
}
