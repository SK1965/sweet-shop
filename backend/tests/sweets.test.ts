import request from 'supertest';
import mongoose from 'mongoose';
import app from '../src/app';
import Sweet from '../src/models/Sweet';
import User from '../src/models/User';

describe('Sweets Endpoints', () => {
  let token: string;

  beforeAll(async () => {
    const mongoUri = process.env.MONGODB_URI_TEST || 'mongodb://localhost:27017/sweetshop_test';
    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(mongoUri);
    }

    // Create a user and get token for protected routes
    const user = new User({ email: 'sweet_admin@example.com', password: 'password123', role: 'admin' });
    await user.save();

    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'sweet_admin@example.com', password: 'password123' });
    
    token = loginRes.body.token;
  });

  afterEach(async () => {
    await Sweet.deleteMany({});
  });

  afterAll(async () => {
    await User.deleteMany({}); // Cleanup user
    await mongoose.connection.close();
  });

  describe('POST /api/sweets', () => {
    it('should allow authenticated user to add a sweet', async () => {
      const res = await request(app)
        .post('/api/sweets')
        .set('Cookie', [`token=${token}`]) // Send token in cookie
        .set('Authorization', `Bearer ${token}`) // Also send in header just in case middleware checks both
        .send({
          name: 'Chocolate Lava Cake',
          category: 'Dessert',
          price: 5.99,
          stock: 20
        });

      expect(res.status).toBe(201);
      expect(res.body.name).toBe('Chocolate Lava Cake');
      expect(res.body.stock).toBe(20);
    });

    it('should return 401 if not authenticated', async () => {
      const res = await request(app)
        .post('/api/sweets')
        .send({
          name: 'Unauthorized Cake',
          category: 'Dessert',
          price: 10,
          stock: 5
        });

      expect(res.status).toBe(401);
    });

    it('should validate input (price must be positive)', async () => {
        const res = await request(app)
          .post('/api/sweets')
          .set('Authorization', `Bearer ${token}`)
          .send({
            name: 'Bad Price Cake',
            category: 'Dessert',
            price: -5,
            stock: 10
          });
  
        // Expecting 400 Bad Request or 500 depending on how validation error is handled. 
        // Ideally 400.
        expect(res.status).toBe(400); 
    });
  });

  describe('GET /api/sweets', () => {
    it('should return a list of sweets', async () => {
      // Seed some sweets
      await Sweet.insertMany([
        { name: 'Candy', category: 'Hard', price: 1, stock: 100 },
        { name: 'Brownie', category: 'Baked', price: 2.5, stock: 50 }
      ]);

      const res = await request(app).get('/api/sweets');
      
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(2);
      expect(res.body[0]).toHaveProperty('name');
    });
  });
  describe('PUT /api/sweets/:id', () => {
    let customerToken: string;
    let sweetId: string;

    beforeAll(async () => {
        // Create normal user
        const customer = new User({ email: 'simple_customer@example.com', password: 'password123', role: 'customer' });
        await customer.save();
        const res = await request(app).post('/api/auth/login').send({ email: 'simple_customer@example.com', password: 'password123' });
        customerToken = res.body.token;
    });

    beforeEach(async () => {
        const sweet = new Sweet({ name: 'Update Me', category: 'Test', price: 10, stock: 10 });
        await sweet.save();
        sweetId = sweet._id.toString();
    });

    it('should update sweet details if admin', async () => {
      const res = await request(app)
        .put(`/api/sweets/${sweetId}`)
        .set('Cookie', [`token=${token}`])
        .send({ price: 15, stock: 5 });

      expect(res.status).toBe(200);
      expect(res.body.price).toBe(15);
      expect(res.body.stock).toBe(5);
    });

    it('should return 403 if user is not admin', async () => {
      const res = await request(app)
        .put(`/api/sweets/${sweetId}`)
        .set('Cookie', [`token=${customerToken}`])
        .send({ price: 15 });

        // Depending on middleware implementation, might be 403 Forbidden.
        expect(res.status).toBe(403);
    });

    it('should return 404 if sweet not found', async () => {
      const res = await request(app)
        .put(`/api/sweets/${new mongoose.Types.ObjectId()}`)
        .set('Cookie', [`token=${token}`])
        .send({ price: 20 });

      expect(res.status).toBe(404);
    });
  });

  describe('DELETE /api/sweets/:id', () => {
    let customerToken: string;
    let sweetId: string;

    beforeAll(async () => {
         // Re-login as customer if previous block didn't run (though it did, redundancy for safety or we can scope customerToken higher)
        // For simplicity, reusing customerToken if set, or getting new one.
        if (!customerToken) {
            const res = await request(app).post('/api/auth/login').send({ email: 'simple_customer@example.com', password: 'password123' });
            customerToken = res.body.token;
        }
    });

    beforeEach(async () => {
        const sweet = new Sweet({ name: 'Delete Me', category: 'Test', price: 10, stock: 10 });
        await sweet.save();
        sweetId = sweet._id.toString();
    });

    it('should delete sweet if admin', async () => {
      const res = await request(app)
        .delete(`/api/sweets/${sweetId}`)
        .set('Cookie', [`token=${token}`]);

      expect(res.status).toBe(200);
      
      const check = await Sweet.findById(sweetId);
      expect(check).toBeNull();
    });

    it('should return 403 if user is not admin', async () => {
      const res = await request(app)
        .delete(`/api/sweets/${sweetId}`)
        .set('Cookie', [`token=${customerToken}`]);

      expect(res.status).toBe(403);
      
      const check = await Sweet.findById(sweetId);
      expect(check).not.toBeNull();
    });

    it('should return 404 if sweet not found', async () => {
      const res = await request(app)
        .delete(`/api/sweets/${new mongoose.Types.ObjectId()}`)
        .set('Cookie', [`token=${token}`]);

      expect(res.status).toBe(404);
    });
  });
  describe('GET /api/sweets/search', () => {
    beforeEach(async () => {
      // Seed data for search
      await Sweet.deleteMany({});
      await Sweet.insertMany([
        { name: 'Chocolate Bar', category: 'Chocolate', price: 2, stock: 100 },
        { name: 'Gummy Bears', category: 'Candy', price: 1, stock: 200 },
        { name: 'Vanilla Ice Cream', category: 'Frozen', price: 5, stock: 50 },
        { name: 'Expensive Truffle', category: 'Chocolate', price: 50, stock: 10 }
      ]);
    });

    it('should search sweets by name', async () => {
      const res = await request(app).get('/api/sweets/search?name=Chocolate');
      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThanOrEqual(1);
      expect(res.body[0].name).toContain('Chocolate');
    });

    it('should search sweets by category', async () => {
      const res = await request(app).get('/api/sweets/search?category=Candy');
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1);
      expect(res.body[0].name).toBe('Gummy Bears');
    });

    it('should filter sweets by price range', async () => {
      const res = await request(app).get('/api/sweets/search?minPrice=3&maxPrice=10');
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1);
      expect(res.body[0].name).toBe('Vanilla Ice Cream');
    });
  });
});
