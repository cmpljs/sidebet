const request = require('supertest');

jest.mock('../config/database', () => ({
  connectDB: jest.fn(),
}));

const app = require('../server');

describe('GET /api/health', () => {
  it('returns status 200 and expected JSON keys', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('message');
    expect(res.body).toHaveProperty('timestamp');
    expect(res.body).toHaveProperty('environment');
  });
});
