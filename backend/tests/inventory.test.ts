import request from 'supertest';
import mongoose from 'mongoose';
import app from '../src/app';
import Sweet from '../src/models/Sweet';
import User from '../src/models/User';
import { describe, it, beforeAll, beforeEach, afterEach, afterAll, expect } from '@jest/globals';
describe('Inventory Endpoints', () => {
    let adminToken: string;
    let customerToken: string;
    let sweetId: string;

    beforeAll(async () => {
        const mongoUri = process.env.MONGODB_URI_TEST || 'mongodb://localhost:27017/sweetshop_test_inventory';
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(mongoUri);
        }

        // Create Admin
        const admin = new User({ email: 'inv_admin@example.com', password: 'password123', role: 'admin' });
        await admin.save();
        const adminLogin = await request(app).post('/api/auth/login').send({ email: 'inv_admin@example.com', password: 'password123' });
        adminToken = adminLogin.body.token;

        // Create Customer
        const customer = new User({ email: 'inv_user@example.com', password: 'password123', role: 'customer' });
        await customer.save();
        const userLogin = await request(app).post('/api/auth/login').send({ email: 'inv_user@example.com', password: 'password123' });
        customerToken = userLogin.body.token;
    });

    beforeEach(async () => {
        await Sweet.deleteMany({});
        const sweet = new Sweet({ name: 'Stock Test Sweet', category: 'Test', price: 10, stock: 10 });
        await sweet.save();
        sweetId = sweet._id.toString();
    });

    afterAll(async () => {
        await User.deleteMany({});
        await Sweet.deleteMany({});
        await mongoose.connection.close();
    });

    describe('POST /api/sweets/:id/purchase', () => {
        it('should allow authenticated user to purchase a sweet', async () => {
            const res = await request(app)
                .post(`/api/sweets/${sweetId}/purchase`)
                .set('Cookie', [`token=${customerToken}`])
                .send({ quantity: 5 });

            expect(res.status).toBe(200);
            expect(res.body.stock).toBe(5); // 10 - 5 = 5
        });

        it('should return 400 if insufficient stock', async () => {
            const res = await request(app)
                .post(`/api/sweets/${sweetId}/purchase`)
                .set('Cookie', [`token=${customerToken}`])
                .send({ quantity: 15 }); // Only 10 in stock

            expect(res.status).toBe(400);
            expect(res.body.message).toMatch(/insufficient stock/i);
        });

        it('should return 400 for invalid quantity', async () => {
            const res = await request(app)
                .post(`/api/sweets/${sweetId}/purchase`)
                .set('Cookie', [`token=${customerToken}`])
                .send({ quantity: -1 });

            expect(res.status).toBe(400);
        });
    });

    describe('POST /api/sweets/:id/restock', () => {
        it('should allow admin to restock a sweet', async () => {
            const res = await request(app)
                .post(`/api/sweets/${sweetId}/restock`)
                .set('Cookie', [`token=${adminToken}`])
                .send({ quantity: 10 });

            expect(res.status).toBe(200);
            expect(res.body.stock).toBe(20); // 10 + 10 = 20
        });

        it('should return 403 if user is not admin', async () => {
            const res = await request(app)
                .post(`/api/sweets/${sweetId}/restock`)
                .set('Cookie', [`token=${customerToken}`])
                .send({ quantity: 10 });

            expect(res.status).toBe(403);
        });

        it('should return 400 for invalid quantity', async () => {
            const res = await request(app)
                .post(`/api/sweets/${sweetId}/restock`)
                .set('Cookie', [`token=${adminToken}`])
                .send({ quantity: -5 });

            expect(res.status).toBe(400);
        });
    });
});
