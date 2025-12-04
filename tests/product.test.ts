import request from "supertest";
import app from "../src/app";
import prisma from "../src/prisma";

let adminToken: string;
let userToken: string;
let testProductId: number;

describe("Product Endpoints", () => {
  beforeAll(async () => {
    // Login as admin
    const adminResponse = await request(app).post("/api/auth/login").send({
      email: "admin@inventory.test",
      password: "password",
    });
    adminToken = adminResponse.body.data.token;

    // Login as regular user
    const userResponse = await request(app).post("/api/auth/login").send({
      email: "user@inventory.test",
      password: "password",
    });
    userToken = userResponse.body.data.token;
  });

  afterAll(async () => {
    // Clean up test product if created
    if (testProductId) {
      await prisma.product.deleteMany({
        where: { id: testProductId },
      });
    }
    await prisma.$disconnect();
  });

  describe("GET /api/products", () => {
    it("should get all products with pagination", async () => {
      const response = await request(app)
        .get("/api/products")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body).toHaveProperty("meta");
      expect(response.body.meta).toHaveProperty("total");
    });

    it("should search products case-insensitively", async () => {
      const response = await request(app)
        .get("/api/products?search=LAPTOP")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
    });

    it("should filter by category slug", async () => {
      const response = await request(app)
        .get("/api/products?category=electronics")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      if (response.body.data.length > 0) {
        expect(response.body.data[0].category.slug).toBe("electronics");
      }
    });

    it("should filter by category ID", async () => {
      const response = await request(app)
        .get("/api/products?category=1")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it("should sort products by price ascending", async () => {
      const response = await request(app)
        .get("/api/products?sort=price&order=asc")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      if (response.body.data.length > 1) {
        const prices = response.body.data.map((p: any) => parseFloat(p.price));
        expect(prices[0]).toBeLessThanOrEqual(prices[1]);
      }
    });

    it("should paginate results", async () => {
      const response = await request(app)
        .get("/api/products?per_page=5&page=2")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.meta.currentPage).toBe(2);
      expect(response.body.meta.perPage).toBe(5);
    });
  });

  describe("GET /api/products/:id", () => {
    it("should get a single product", async () => {
      const response = await request(app)
        .get("/api/products/1")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty("id", 1);
      expect(response.body.data).toHaveProperty("category");
    });

    it("should return 404 for non-existent product", async () => {
      const response = await request(app)
        .get("/api/products/99999")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });

  describe("POST /api/products", () => {
    it("should create product as admin", async () => {
      const response = await request(app)
        .post("/api/products")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          name: "Test Product",
          description: "Test description",
          quantity: 10,
          price: 99.99,
          categoryId: 1,
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty("name", "Test Product");
      testProductId = response.body.data.id;
    });

    it("should fail as regular user", async () => {
      const response = await request(app)
        .post("/api/products")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          name: "Another Product",
          quantity: 5,
          price: 49.99,
          categoryId: 1,
        });

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
    });

    it("should fail with invalid data", async () => {
      const response = await request(app)
        .post("/api/products")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          name: "P", // Too short
          quantity: -1, // Negative
          price: -10, // Negative
        });

      expect(response.status).toBe(422);
      expect(response.body.success).toBe(false);
    });
  });

  describe("PUT /api/products/:id", () => {
    it("should update product as admin", async () => {
      if (!testProductId) {
        // Create a product first
        const createResponse = await request(app)
          .post("/api/products")
          .set("Authorization", `Bearer ${adminToken}`)
          .send({
            name: "Product to Update",
            quantity: 5,
            price: 29.99,
            categoryId: 1,
          });
        testProductId = createResponse.body.data.id;
      }

      const response = await request(app)
        .put(`/api/products/${testProductId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          name: "Updated Product",
          price: 39.99,
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty("name", "Updated Product");
    });

    it("should fail as regular user", async () => {
      const response = await request(app)
        .put("/api/products/1")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          name: "Unauthorized Update",
        });

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
    });
  });

  describe("DELETE /api/products/:id", () => {
    it("should soft delete product as admin", async () => {
      if (!testProductId) {
        // Create a product first
        const createResponse = await request(app)
          .post("/api/products")
          .set("Authorization", `Bearer ${adminToken}`)
          .send({
            name: "Product to Delete",
            quantity: 1,
            price: 9.99,
            categoryId: 1,
          });
        testProductId = createResponse.body.data.id;
      }

      const response = await request(app)
        .delete(`/api/products/${testProductId}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);

      // Verify product is soft deleted
      const getResponse = await request(app)
        .get(`/api/products/${testProductId}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(getResponse.status).toBe(404);
    });

    it("should fail as regular user", async () => {
      const response = await request(app)
        .delete("/api/products/1")
        .set("Authorization", `Bearer ${userToken}`);

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
    });
  });
});
