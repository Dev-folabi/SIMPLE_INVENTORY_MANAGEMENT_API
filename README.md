# Simple Inventory Management API

A RESTful API built with **Laravel 11** and **PostgreSQL** for managing inventory with authentication, product/category management, search, filtering, sorting, and role-based access control.

## Features

-   ✅ **Token-based Authentication** (Laravel Sanctum)
-   ✅ **Product Management** (CRUD with soft deletes)
-   ✅ **Category Management** (Create & List)
-   ✅ **Advanced Search & Filtering** (by name, category)
-   ✅ **Sorting** (name, price, quantity)
-   ✅ **Pagination** (customizable per page)
-   ✅ **Role-based Access Control** (Admin/User)
-   ✅ **API Rate Limiting** (60 requests/minute)
-   ✅ **Comprehensive Test Suite**
-   ✅ **Consistent JSON Responses**

## Technology Stack

-   **Framework**: Laravel 11
-   **Database**: PostgreSQL
-   **Authentication**: Laravel Sanctum
-   **Testing**: PHPUnit with SQLite in-memory
-   **PHP Version**: 8.2+

## Installation

### Prerequisites

-   PHP 8.2 or higher
-   Composer
-   PostgreSQL
-   PHP Extensions: `pdo_pgsql`, `mbstring`, `xml`, `curl`, `zip`, `bcmath`

### Step 1: Clone the Repository

```bash
git clone <SIMPLE_INVENTORY_MANAGEMENT_API>
cd SIMPLE_INVENTORY_MANAGEMENT_API
```

### Step 2: Install Dependencies

```bash
composer install
```

### Step 3: Environment Configuration

```bash
cp .env.example .env
php artisan key:generate
```

Update `.env` with your PostgreSQL credentials:

```env
DB_CONNECTION=pgsql
DB_HOST=localhost
DB_PORT=5432
DB_DATABASE=IMA
DB_USERNAME=user
DB_PASSWORD=
```

### Step 4: Database Setup

Create the PostgreSQL database and user:

```bash
sudo -u postgres psql << EOF
CREATE DATABASE "IMA";
CREATE USER "user" WITH PASSWORD 'PASSWORD';
GRANT ALL PRIVILEGES ON DATABASE "IMA" TO "user";
ALTER DATABASE "IMA" OWNER TO "user";
EOF
```

### Step 5: Run Migrations and Seeders

```bash
php artisan migrate:fresh --seed
```

This will create:

-   **Admin user**: `admin@inventory.test` / `password`
-   **Regular user**: `user@inventory.test` / `password`
-   **6 categories**: Electronics, Furniture, Clothing, Food & Beverages, Books, Sports Equipment
-   **15 sample products** across various categories

### Step 6: Start the Development Server

```bash
php artisan serve
```

The API will be available at `http://localhost:8000`

## API Endpoints

### Authentication

| Method | Endpoint        | Description                | Auth Required |
| ------ | --------------- | -------------------------- | ------------- |
| POST   | `/api/register` | Register new user          | No            |
| POST   | `/api/login`    | Login user                 | No            |
| POST   | `/api/logout`   | Logout user (revoke token) | Yes           |

### Categories

| Method | Endpoint          | Description         | Auth Required | Admin Only |
| ------ | ----------------- | ------------------- | ------------- | ---------- |
| GET    | `/api/categories` | List all categories | Yes           | No         |
| POST   | `/api/categories` | Create category     | Yes           | Yes        |

### Products

| Method | Endpoint             | Description                  | Auth Required | Admin Only |
| ------ | -------------------- | ---------------------------- | ------------- | ---------- |
| GET    | `/api/products`      | List products (with filters) | Yes           | No         |
| POST   | `/api/products`      | Create product               | Yes           | Yes        |
| GET    | `/api/products/{id}` | Get single product           | Yes           | No         |
| PUT    | `/api/products/{id}` | Update product               | Yes           | Yes        |
| DELETE | `/api/products/{id}` | Delete product (soft delete) | Yes           | Yes        |

### Query Parameters for GET /api/products

-   `search` - Search by product name (case-insensitive, e.g., `?search=laptop`)
-   `category` - Filter by category ID or slug (e.g., `?category=1` or `?category=electronics`)
-   `sort` - Sort field: `name`, `price`, `quantity`, `created_at` (e.g., `?sort=price`)
-   `order` - Sort order: `asc` or `desc` (e.g., `?order=asc`)
-   `per_page` - Items per page, max 100 (e.g., `?per_page=20`)
-   `page` - Page number for pagination (e.g., `?page=2`)

**Example**: `/api/products?search=laptop&category=electronics&sort=price&order=asc&per_page=10&page=1`

**Pagination Navigation**: Use the `page` parameter to navigate between pages. The response includes `meta` data with `current_page`, `last_page`, and `total` to help with pagination.

## Authentication

All protected endpoints require a Bearer token in the Authorization header:

```bash
Authorization: Bearer {token-here}
```

### Example: Login and Get Token

```bash
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "email": "admin@inventory.test",
    "password": "password"
  }'
```

Response:

```json
{
    "success": true,
    "message": "Login successful",
    "data": {
        "user": {
            "id": 1,
            "name": "Admin User",
            "email": "admin@inventory.test",
            "role": "admin"
        },
        "token": "1|abc123..."
    }
}
```

## Request/Response Examples

### Create Product (Admin Only)

**Request:**

```bash
curl -X POST http://localhost:8000/api/products \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Gaming Laptop",
    "description": "High-performance gaming laptop",
    "quantity": 10,
    "price": 1999.99,
    "category_id": 1
  }'
```

**Response:**

```json
{
    "success": true,
    "message": "Product created successfully",
    "data": {
        "id": 16,
        "name": "Gaming Laptop",
        "description": "High-performance gaming laptop",
        "quantity": 10,
        "price": "1999.99",
        "category": {
            "id": 1,
            "name": "Electronics",
            "slug": "electronics"
        },
        "created_at": "2025-12-01T18:00:00Z"
    }
}
```

### List Products with Filters

**Request:**

```bash
curl -X GET "http://localhost:8000/api/products?search=laptop&sort=price&order=asc" \
  -H "Authorization: Bearer {token}"
```

**Response:**

```json
{
    "success": true,
    "message": "Products retrieved successfully",
    "data": [
        {
            "id": 1,
            "name": "Laptop",
            "description": "High-performance gaming laptop with RTX 4070",
            "quantity": 15,
            "price": "1999.99",
            "category": {
                "id": 1,
                "name": "Electronics",
                "slug": "electronics"
            },
            "created_at": "2025-12-01T16:00:00Z"
        }
    ],
    "meta": {
        "current_page": 1,
        "from": 1,
        "last_page": 1,
        "per_page": 15,
        "to": 1,
        "total": 1
    }
}
```

## Testing

### Run Tests

```bash
php artisan test
```

**Note**: Tests require SQLite PDO extension. Install with:

```bash
sudo apt install php8.3-sqlite3
```

### Test Coverage

-   ✅ Authentication (register, login, validation)
-   ✅ Category CRUD and authorization
-   ✅ Product CRUD and authorization
-   ✅ Search, filter, sort, pagination
-   ✅ Role-based access control

## Project Structure

```
app/
├── Http/
│   ├── Controllers/API/
│   │   ├── AuthController.php
│   │   ├── CategoryController.php
│   │   └── ProductController.php
│   ├── Requests/
│   │   ├── Auth/
│   │   ├── Category/
│   │   └── Product/
│   └── Resources/
│       ├── CategoryResource.php
│       ├── ProductResource.php
│       └── ProductCollection.php
├── Models/
│   ├── User.php
│   ├── Category.php
│   └── Product.php
└── Services/
    ├── CategoryService.php
    └── ProductService.php

database/
├── migrations/
└── seeders/
    └── DatabaseSeeder.php

routes/
└── api.php

tests/
└── Feature/
    ├── AuthTest.php
    ├── CategoryTest.php
    └── ProductTest.php
```

## Security Features

-   ✅ Password hashing with bcrypt
-   ✅ Token-based authentication (Sanctum)
-   ✅ Input validation on all endpoints
-   ✅ Mass assignment protection
-   ✅ Rate limiting (60 requests/minute)
-   ✅ Role-based authorization
-   ✅ SQL injection protection (Eloquent ORM)

## Database Schema

### Users Table

-   `id`, `name`, `email` (unique), `password`, `role` (user/admin), `timestamps`

### Categories Table

-   `id`, `name` (unique), `slug` (unique, auto-generated), `timestamps`
-   **Indexes**: `slug`

### Products Table

-   `id`, `name`, `description`, `quantity`, `price`, `category_id` (foreign key), `timestamps`, `deleted_at`
-   **Indexes**: `name`, `category_id`
-   **Soft Deletes**: Enabled

## Design Decisions

1. **Service Layer**: Business logic separated into service classes for maintainability
2. **Form Requests**: Validation and authorization handled in dedicated request classes
3. **API Resources**: Consistent JSON response formatting
4. **Soft Deletes**: Products are soft-deleted for data recovery
5. **Auto-slug Generation**: Category slugs auto-generated from names
6. **Allowlist Sorting**: Only predefined fields can be sorted to prevent SQL injection
7. **Rate Limiting**: Prevents API abuse
8. **Role-based Access**: Admin-only operations protected at request level

## Postman Collection

Import `postman_collection.json` into Postman for easy API testing. The collection includes:

-   All API endpoints with sample requests
-   Environment variables for base URL and token
-   Pre-request scripts for authentication
-   Test assertions

## Troubleshooting

### PostgreSQL Connection Issues

```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql

# Start PostgreSQL
sudo systemctl start postgresql
```

### Permission Errors

```bash
# Fix storage permissions
chmod -R 775 storage bootstrap/cache
```

### Clear Cache

```bash
php artisan config:clear
php artisan cache:clear
php artisan route:clear
```

## License

This project is open-source and available under the MIT License.

## Author

Yusuf Afolabi - Built as a technical assessment for backend engineering skills demonstration.
