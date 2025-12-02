<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CategoryTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test listing all categories
     */
    public function test_authenticated_user_can_list_categories(): void
    {
        $user = User::factory()->create();
        Category::factory()->count(3)->create();

        $response = $this->actingAs($user, 'sanctum')
            ->getJson('/api/categories');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'message',
                'data' => [
                    '*' => ['id', 'name', 'slug'],
                ],
            ]);
    }

    /**
     * Test admin can create category
     */
    public function test_admin_can_create_category(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $response = $this->actingAs($admin, 'sanctum')
            ->postJson('/api/categories', [
                'name' => 'Test Category',
            ]);

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
            ]);

        $this->assertDatabaseHas('categories', [
            'name' => 'Test Category',
        ]);
    }

    /**
     * Test regular user cannot create category
     */
    public function test_regular_user_cannot_create_category(): void
    {
        $user = User::factory()->create(['role' => 'user']);

        $response = $this->actingAs($user, 'sanctum')
            ->postJson('/api/categories', [
                'name' => 'Test Category',
            ]);

        $response->assertStatus(403);
    }

    /**
     * Test slug auto-generation
     */
    public function test_category_slug_is_auto_generated(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $response = $this->actingAs($admin, 'sanctum')
            ->postJson('/api/categories', [
                'name' => 'Test Category Name',
            ]);

        $response->assertStatus(201);
        
        $this->assertDatabaseHas('categories', [
            'name' => 'Test Category Name',
            'slug' => 'test-category-name',
        ]);
    }
}
