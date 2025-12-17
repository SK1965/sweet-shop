import request from 'supertest';
import mongoose from 'mongoose';
import app from '../src/app';
import User from '../src/models/User';
import { describe, it, beforeAll, beforeEach, afterEach, afterAll, expect } from '@jest/globals';
describe('Authentication Endpoints', () => {
  beforeAll(async () => {
    // Connect to a test database
    const mongoUri = process.env.MONGODB_URI_TEST || 'mongodb://localhost:27017/sweetshop_test';
    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(mongoUri);
    }
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new customer', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'customer@example.com',
          password: 'password123',
          role: 'customer'
        });
      
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('message', 'User registered successfully');
      expect(res.body.user).toHaveProperty('email', 'customer@example.com');
      expect(res.body.user.role).toBe('customer');
      expect(res.body.user).not.toHaveProperty('password');
    });

    it('should register a new admin', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'admin@example.com',
          password: 'adminpassword',
          role: 'admin'
        });
      
      expect(res.status).toBe(201);
      expect(res.body.user.role).toBe('admin');
    });

    it('should fail if email already exists', async () => {
      // First registration
      const user = new User({ email: 'duplicate@example.com', password: 'password123', role: 'customer' });
      await user.save();

      // Duplicate registration try via API
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'duplicate@example.com',
          password: 'newpassword',
          role: 'customer'
        });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('message', 'User already exists');
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Create users for login tests directly in DB
      const customer = new User({ email: 'customer@example.com', password: 'password123', role: 'customer' });
      await customer.save();

      const admin = new User({ email: 'admin@example.com', password: 'adminpassword', role: 'admin' });
      await admin.save();
    });

    it('should login customer with valid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'customer@example.com',
          password: 'password123',
        });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
    });

    it('should login admin with valid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'admin@example.com',
          password: 'adminpassword',
        });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
    });

    it('should return 401 with invalid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'customer@example.com',
          password: 'wrongpassword',
        });

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('message', 'Invalid credentials');
    });

    it('should return 401 for non-existent user', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'ghost@example.com',
          password: 'password123',
        });

      expect(res.status).toBe(401);
    });
  });
});
