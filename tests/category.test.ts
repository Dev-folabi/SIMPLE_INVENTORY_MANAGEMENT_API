import request from 'supertest';
import app from '../src/app';
import prisma from "../src/prisma";

let adminToken: string;

describe('Category Endpoints', () => {
  beforeAll(async () => {
    // Login as admin to get token
    const response = await request(app).post('/api/auth/login').send({
      email: 'admin@inventory.test',
      password: 'password',
    });
    adminToken = response.body.data.token;

    // Clean up test category
    await prisma.category.deleteMany({
      where: { name: 'Test Category' },
    });
  });

  afterAll(async () => {
    // Clean up test category
    await prisma.category.deleteMany({
      where: { name: 'Test Category' },
    });
    await prisma.$disconnect();
  });

  describe('GET /api/categories', () => {
    it('should get all categories with valid token', async () => {
      const response = await request(app)
        .get('/api/categories')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
    });

    it('should fail without token', async () => {
      const response = await request(app).get('/api/categories');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/categories', () => {
    it('should create category as admin', async () => {
      const response = await request(app)
        .post('/api/categories')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Test Category',
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('name', 'Test Category');
      expect(response.body.data).toHaveProperty('slug', 'test-category');
    });

    it('should fail with duplicate category name', async () => {
      const response = await request(app)
        .post('/api/categories')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Test Category',
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should fail as regular user', async () => {
      // Login as regular user
      const loginResponse = await request(app).post('/api/auth/login').send({
        email: 'user@inventory.test',
        password: 'password',
      });

      const userToken = loginResponse.body.data.token;

      const response = await request(app)
        .post('/api/categories')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          name: 'Another Category',
        });

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
    });

    it('should fail with invalid data', async () => {
      const response = await request(app)
        .post('/api/categories')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'A', // Too short
        });

      expect(response.status).toBe(422);
      expect(response.body.success).toBe(false);
    });
  });
});
