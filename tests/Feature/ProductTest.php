<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProductTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        // Create a category for testing
        Category::factory()->create(['id' => 1, 'name' => 'Electronics']);
    }

    /** Test listing products */
    public function test_authenticated_user_can_list_products(): void
    {
        $user = User::factory()->create();
        Product::factory()->count(5)->create(['category_id' => 1]);

        $response = $this->actingAs($user, 'sanctum')
            ->getJson('/api/products');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'message',
                'data' => [
                    '*' => ['id', 'name', 'description', 'quantity', 'price', 'category'],
                ],
                'meta',
            ]);
    }

    /** Test creating product as admin */
    public function test_admin_can_create_product(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $response = $this->actingAs($admin, 'sanctum')
            ->postJson('/api/products', [
                'name' => 'Test Product',
                'description' => 'Test Description',
                'quantity' => 10,
                'price' => 99.99,
                'category_id' => 1,
            ]);

        $response->assertStatus(201)
            ->assertJson(['success' => true]);

        $this->assertDatabaseHas('products', [
            'name' => 'Test Product',
        ]);
    }

    /** Test regular user cannot create product */
    public function test_regular_user_cannot_create_product(): void
    {
        $user = User::factory()->create(['role' => 'user']);

        $response = $this->actingAs($user, 'sanctum')
            ->postJson('/api/products', [
                'name' => 'Test Product',
                'description' => 'Test Description',
                'quantity' => 10,
                'price' => 99.99,
                'category_id' => 1,
            ]);

        $response->assertStatus(403);
    }

    /** Test getting single product */
    public function test_user_can_get_single_product(): void
    {
        $user = User::factory()->create();
        $product = Product::factory()->create(['category_id' => 1]);

        $response = $this->actingAs($user, 'sanctum')
            ->getJson("/api/products/{$product->id}");

        $response->assertStatus(200)
            ->assertJson(['success' => true])
            ->assertJsonStructure([
                'data' => ['id', 'name', 'description', 'quantity', 'price', 'category'],
            ]);
    }

    /** Test updating product as admin */
    public function test_admin_can_update_product(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $product = Product::factory()->create(['category_id' => 1]);

        $response = $this->actingAs($admin, 'sanctum')
            ->putJson("/api/products/{$product->id}", [
                'name' => 'Updated Product',
                'price' => 149.99,
            ]);

        $response->assertStatus(200)
            ->assertJson(['success' => true]);

        $this->assertDatabaseHas('products', [
            'id' => $product->id,
            'name' => 'Updated Product',
        ]);
    }

    /** Test deleting product (soft delete) */
    public function test_admin_can_delete_product(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $product = Product::factory()->create(['category_id' => 1]);

        $response = $this->actingAs($admin, 'sanctum')
            ->deleteJson("/api/products/{$product->id}");

        $response->assertStatus(200);
        $this->assertSoftDeleted('products', ['id' => $product->id]);
    }

    /** Test search by name */
    public function test_can_search_products_by_name(): void
    {
        $user = User::factory()->create();
        Product::factory()->create(['name' => 'Laptop', 'category_id' => 1]);
        Product::factory()->create(['name' => 'Mouse', 'category_id' => 1]);

        $response = $this->actingAs($user, 'sanctum')
            ->getJson('/api/products?search=Laptop');

        $response->assertStatus(200);
        $data = $response->json('data');
        $this->assertCount(1, $data);
        $this->assertEquals('Laptop', $data[0]['name']);
    }

    /** Test filter by category */
    public function test_can_filter_products_by_category(): void
    {
        $user = User::factory()->create();
        $category2 = Category::factory()->create(['id' => 2]);
        
        Product::factory()->create(['category_id' => 1]);
        Product::factory()->create(['category_id' => 2]);

        $response = $this->actingAs($user, 'sanctum')
            ->getJson('/api/products?category=1');

        $response->assertStatus(200);
        $data = $response->json('data');
        $this->assertCount(1, $data);
    }

    /** Test sorting */
    public function test_can_sort_products(): void
    {
        $user = User::factory()->create();
        Product::factory()->create(['name' => 'B Product', 'price' => 50, 'category_id' => 1]);
        Product::factory()->create(['name' => 'A Product', 'price' => 100, 'category_id' => 1]);

        $response = $this->actingAs($user, 'sanctum')
            ->getJson('/api/products?sort=name&order=asc');

        $response->assertStatus(200);
        $data = $response->json('data');
        $this->assertEquals('A Product', $data[0]['name']);
    }

    /** Test pagination */
    public function test_products_are_paginated(): void
    {
        $user = User::factory()->create();
        Product::factory()->count(20)->create(['category_id' => 1]);

        $response = $this->actingAs($user, 'sanctum')
            ->getJson('/api/products?per_page=10');

        $response->assertStatus(200)
            ->assertJsonStructure(['meta' => ['total', 'per_page', 'current_page']]);
        
        $this->assertEquals(10, count($response->json('data')));
    }
}
