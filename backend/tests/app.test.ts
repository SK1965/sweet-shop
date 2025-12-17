import request from 'supertest';
import app from '../src/app';
import { describe, it, expect } from '@jest/globals';
describe('App', () => {
  it('should return 200 OK for the root route', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: 'Sweet Shop API' });
  });
});
