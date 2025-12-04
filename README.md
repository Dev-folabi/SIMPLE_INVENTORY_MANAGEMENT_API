# Inventory Management API

A RESTful API built with **Node.js**, **Express**, **TypeScript**, and **Prisma** for managing inventory with authentication, product/category management, search, filtering, sorting, and role-based access control.

## ✨ Features

- ✅ **Token-based Authentication** (JWT)
- ✅ **Product Management** (CRUD with soft deletes)
- ✅ **Category Management** (Create & List)
- ✅ **Advanced Search & Filtering** (case-insensitive by name, category)
- ✅ **Sorting** (name, price, quantity, createdAt)
- ✅ **Pagination** (customizable per page)
- ✅ **Role-based Access Control** (Admin/User)
- ✅ **API Rate Limiting** (60 requests/minute)
- ✅ **Comprehensive Test Suite** (Jest)
- ✅ **Consistent JSON Responses**

## 🛠 Technology Stack

- **Runtime**: Node.js 18+
- **Language**: TypeScript
- **Framework**: Express.js
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Authentication**: JWT (jsonwebtoken)
- **Validation**: express-validator
- **Password Hashing**: bcrypt
- **Testing**: Jest + Supertest

## 📦 Installation

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL
- Git

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd SIMPLE_INVENTORY_MANAGEMENT_API
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Environment Configuration

```bash
cp .env.example .env
```

Update `.env` with your PostgreSQL credentials:

```env
NODE_ENV=development
PORT=8000
DATABASE_URL="postgresql://user:password@localhost:5432/IMA?schema=public"
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=60
```

### Step 4: Database Setup

Create the PostgreSQL database:

```bash
sudo -u postgres psql <<EOF
CREATE DATABASE "IMA";
CREATE USER "user" WITH PASSWORD 'your-password';
GRANT ALL PRIVILEGES ON DATABASE "IMA" TO "user";
ALTER DATABASE "IMA" OWNER TO "user";
EOF
```

### Step 5: Run Prisma Migrations and Seed

```bash
npx prisma generate
npx prisma db push
npm run prisma:seed
```

This will create:

- **Admin user**: `admin@inventory.test` / `password`
- **Regular user**: `user@inventory.test` / `password`
- **6 categories**: Electronics, Furniture, Clothing, Food & Beverages, Books, Sports Equipment
- **15 sample products** across various categories

### Step 6: Start the Development Server

```bash
npm run dev
```

The API will be available at `http://localhost:8000`

## 🚀 API Endpoints

### Authentication

| Method | Endpoint             | Description                | Auth Required |
| ------ | -------------------- | -------------------------- | ------------- |
| POST   | `/api/auth/register` | Register new user          | No            |
| POST   | `/api/auth/login`    | Login user                 | No            |
| POST   | `/api/auth/logout`   | Logout user (revoke token) | Yes           |

### Categories

| Method | Endpoint          | Description         | Auth Required | Admin Only |
| ------ | ----------------- | ------------------- | ------------- | ---------- |
| GET    | `/api/categories` | List all categories | Yes           | No         |
| POST   | `/api/categories` | Create category     | Yes           | Yes        |

### Products

| Method | Endpoint            | Description                  | Auth Required | Admin Only |
| ------ | ------------------- | ---------------------------- | ------------- | ---------- |
| GET    | `/api/products`     | List products (with filters) | Yes           | No         |
| POST   | `/api/products`     | Create product               | Yes           | Yes        |
| GET    | `/api/products/:id` | Get single product           | Yes           | No         |
| PUT    | `/api/products/:id` | Update product               | Yes           | Yes        |
| DELETE | `/api/products/:id` | Delete product (soft delete) | Yes           | Yes        |

### Query Parameters for GET /api/products

- `search` - Search by product name (case-insensitive, e.g., `?search=laptop`)
- `category` - Filter by category ID or slug (e.g., `?category=1` or `?category=electronics`)
- `sort` - Sort field: `name`, `price`, `quantity`, `createdAt` (e.g., `?sort=price`)
- `order` - Sort order: `asc` or `desc` (e.g., `?order=asc`)
- `per_page` - Items per page, max 100 (e.g., `?per_page=20`)
- `page` - Page number for pagination (e.g., `?page=2`)

**Example**: `/api/products?search=laptop&category=electronics&sort=price&order=asc&per_page=10&page=1`

**Pagination Navigation**: Use the `page` parameter to navigate between pages. The response includes `meta` data with `currentPage`, `lastPage`, and `total` to help with pagination.

## 🔐 Authentication

All protected endpoints require a Bearer token in the Authorization header:

```bash
Authorization: Bearer {token-here}
```

### Example: Login and Get Token

```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
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
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

## 📝 Request/Response Examples

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
    "categoryId": 1
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
    "createdAt": "2025-12-04T10:00:00Z"
  }
}
```

### List Products with Filters

**Request:**

```bash
curl "http://localhost:8000/api/products?search=laptop&sort=price&order=asc" \
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
      "createdAt": "2025-12-04T09:00:00Z"
    }
  ],
  "meta": {
    "currentPage": 1,
    "from": 1,
    "lastPage": 1,
    "perPage": 15,
    "to": 1,
    "total": 1
  }
}
```

## 🧪 Testing

### Run Tests

```bash
npm test
```

### Run Tests in Watch Mode

```bash
npm run test:watch
```

### Test Coverage

- ✅ Authentication (register, login, logout, validation)
- ✅ Category CRUD and authorization
- ✅ Product CRUD and authorization
- ✅ Search, filter, sort, pagination
- ✅ Role-based access control

## 📁 Project Structure

```
├── src/
│   ├── controllers/       # Request handlers
│   ├── middleware/        # Auth, admin, validation, error handling
│   ├── routes/            # API route definitions
│   ├── services/          # Business logic
│   ├── types/             # TypeScript type definitions
│   ├── utils/             # JWT, response utilities
│   ├── validators/        # express-validator schemas
│   ├── app.ts             # Express app configuration
│   └── server.ts          # Server entry point
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.ts            # Database seeder
├── tests/                 # Jest test files
├── .env                   # Environment variables
├── package.json           # Dependencies and scripts
└── tsconfig.json          # TypeScript configuration
```

## 🔒 Security Features

- ✅ Password hashing with bcrypt (12 rounds)
- ✅ Token-based authentication (JWT)
- ✅ Input validation on all endpoints
- ✅ Rate limiting (60 requests/minute)
- ✅ Role-based authorization
- ✅ SQL injection protection (Prisma ORM)
- ✅ CORS enabled

## 🗄 Database Schema

### Users Table

- `id`, `name`, `email` (unique), `password`, `role` (user/admin), `createdAt`, `updatedAt`

### Categories Table

- `id`, `name` (unique), `slug` (unique, auto-generated), `createdAt`, `updatedAt`
- **Indexes**: `slug`

### Products Table

- `id`, `name`, `description`, `quantity`, `price`, `categoryId` (foreign key), `deletedAt` (soft delete), `createdAt`, `updatedAt`
- **Indexes**: `name`, `categoryId`
- **Soft Deletes**: Enabled

## 🎯 Design Decisions

1. **Service Layer**: Business logic separated into service classes for maintainability
2. **Validation**: express-validator for comprehensive input validation
3. **Consistent Responses**: Utility functions ensure uniform JSON responses
4. **Soft Deletes**: Products are soft-deleted for data recovery
5. **Auto-slug Generation**: Category slugs auto-generated from names
6. **Allowlist Sorting**: Only predefined fields can be sorted to prevent injection
7. **Rate Limiting**: Prevents API abuse
8. **Role-based Access**: Admin-only operations protected at route level

## 📮 Postman Collection

Import `postman_collection.json` into Postman for easy API testing. The collection includes:

- All API endpoints with sample requests
- Environment variables for base URL and token
- Pre-request scripts for authentication
- Test assertions

## 🛠 Available Scripts

```bash
npm run dev          # Start development server with nodemon
npm run build        # Compile TypeScript to JavaScript
npm start            # Run compiled JavaScript
npm test             # Run Jest tests with coverage
npm run test:watch   # Run tests in watch mode
npm run prisma:generate  # Generate Prisma client
npm run prisma:push      # Push schema to database
npm run prisma:seed      # Seed database with sample data
```

## 🐛 Troubleshooting

### PostgreSQL Connection Issues

```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql

# Start PostgreSQL
sudo systemctl start postgresql
```

### Port Already in Use

Change the `PORT` in `.env` file to use a different port.

### Database Schema Issues

```bash
# Reset database and reseed
npx prisma db push --force-reset
npm run prisma:seed
```

## 📄 License

This project is open-source and available under the MIT License.

## 👤 Author

Built with Node.js, Express, TypeScript, and Prisma for modern API development.
