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
});
