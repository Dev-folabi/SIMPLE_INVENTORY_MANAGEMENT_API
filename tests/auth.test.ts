import request from "supertest";
import app from "../src/app";
import prisma from "../src/prisma";

describe("Authentication Endpoints", () => {
  beforeAll(async () => {
    // Clean up test users before running tests
    await prisma.user.deleteMany({
      where: {
        email: {
          in: ["test@example.com", "newuser@example.com"],
        },
      },
    });
  });

  afterAll(async () => {
    // Clean up test users after tests
    await prisma.user.deleteMany({
      where: {
        email: {
          in: ["test@example.com", "newuser@example.com"],
        },
      },
    });
    await prisma.$disconnect();
  });

  describe("POST /api/auth/register", () => {
    it("should register a new user successfully", async () => {
      const response = await request(app).post("/api/auth/register").send({
        name: "Test User",
        email: "test@example.com",
        password: "password123",
        password_confirmation: "password123",
        role: "user",
      });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty("token");
      expect(response.body.data.user).toHaveProperty(
        "email",
        "test@example.com"
      );
      expect(response.body.data.user).not.toHaveProperty("password");
    });

    it("should fail with duplicate email", async () => {
      const response = await request(app).post("/api/auth/register").send({
        name: "Test User",
        email: "test@example.com",
        password: "password123",
        password_confirmation: "password123",
      });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it("should fail with invalid email", async () => {
      const response = await request(app).post("/api/auth/register").send({
        name: "Test User",
        email: "invalid-email",
        password: "password123",
        password_confirmation: "password123",
      });

      expect(response.status).toBe(422);
      expect(response.body.success).toBe(false);
    });

    it("should fail with password mismatch", async () => {
      const response = await request(app).post("/api/auth/register").send({
        name: "Test User",
        email: "newuser@example.com",
        password: "password123",
        password_confirmation: "different123",
      });

      expect(response.status).toBe(422);
      expect(response.body.success).toBe(false);
    });
  });

  describe("POST /api/auth/login", () => {
    it("should login successfully with correct credentials", async () => {
      const response = await request(app).post("/api/auth/login").send({
        email: "admin@inventory.test",
        password: "password",
      });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty("token");
      expect(response.body.data.user).toHaveProperty("role", "admin");
    });

    it("should fail with incorrect password", async () => {
      const response = await request(app).post("/api/auth/login").send({
        email: "admin@inventory.test",
        password: "wrongpassword",
      });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it("should fail with non-existent email", async () => {
      const response = await request(app).post("/api/auth/login").send({
        email: "nonexistent@example.com",
        password: "password",
      });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe("POST /api/auth/logout", () => {
    it("should logout successfully with valid token", async () => {
      // First login to get a token
      const loginResponse = await request(app).post("/api/auth/login").send({
        email: "admin@inventory.test",
        password: "password",
      });

      const token = loginResponse.body.data.token;

      const response = await request(app)
        .post("/api/auth/logout")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it("should fail without token", async () => {
      const response = await request(app).post("/api/auth/logout");

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });
});
