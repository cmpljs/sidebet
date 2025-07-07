const request = require('supertest');

jest.mock('../config/database', () => ({
  connectDB: jest.fn(),
}));

jest.mock('../middleware/auth', () => ({
  protect: (req, res, next) => next(),
  optionalAuth: (req, res, next) => next(),
}));

jest.mock('../controllers/authController', () => ({
  register: (req, res) => res.status(201).json({ message: 'register handler' }),
  login: (req, res) => res.json({ message: 'login handler' }),
  getMe: (req, res) => res.json({ message: 'getMe handler' }),
}));

jest.mock('../controllers/betController', () => ({
  createBet: (req, res) => res.status(201).json({ message: 'createBet handler' }),
  getBet: (req, res) => res.json({ message: 'getBet handler' }),
  acceptBet: (req, res) => res.json({ message: 'acceptBet handler' }),
  getMyBets: (req, res) => res.json({ message: 'getMyBets handler' }),
  getAllBets: (req, res) => res.json({ message: 'getAllBets handler' }),
  deleteBet: (req, res) => res.json({ message: 'deleteBet handler' }),
  markBetAsWon: (req, res) => res.json({ message: 'markBetAsWon handler' }),
  markBetAsLost: (req, res) => res.json({ message: 'markBetAsLost handler' }),
  getLeaderboard: (req, res) => res.json({ message: 'getLeaderboard handler' }),
}));

const app = require('../server');

describe('API endpoints', () => {
  test('GET /health', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
  });

  test('GET /api/health', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
  });

  test('POST /api/register', async () => {
    const res = await request(app)
      .post('/api/register')
      .send({ email: 'test@example.com', password: 'password', name: 'Test' });
    expect(res.status).toBe(201);
  });

  test('POST /api/login', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({ email: 'test@example.com', password: 'password' });
    expect(res.status).toBe(200);
  });

  test('GET /api/me', async () => {
    const res = await request(app).get('/api/me');
    expect(res.status).toBe(200);
  });

  test('POST /api/bets', async () => {
    const res = await request(app)
      .post('/api/bets')
      .send({ name: 'Bet', description: 'desc', size: 10 });
    expect(res.status).toBe(201);
  });

  test('GET /api/bets/my-bets', async () => {
    const res = await request(app).get('/api/bets/my-bets');
    expect(res.status).toBe(200);
  });

  test('GET /api/bets', async () => {
    const res = await request(app).get('/api/bets');
    expect(res.status).toBe(200);
  });

  test('GET /api/bets/leaderboard', async () => {
    const res = await request(app).get('/api/bets/leaderboard');
    expect(res.status).toBe(200);
  });

  test('GET /api/bets/:id', async () => {
    const res = await request(app).get('/api/bets/123');
    expect(res.status).toBe(200);
  });

  test('POST /api/bets/:id/accept', async () => {
    const res = await request(app).post('/api/bets/123/accept');
    expect(res.status).toBe(200);
  });

  test('DELETE /api/bets/:id', async () => {
    const res = await request(app).delete('/api/bets/123');
    expect(res.status).toBe(200);
  });

  test('POST /api/bets/:id/mark-won', async () => {
    const res = await request(app).post('/api/bets/123/mark-won');
    expect(res.status).toBe(200);
  });

  test('POST /api/bets/:id/mark-lost', async () => {
    const res = await request(app).post('/api/bets/123/mark-lost');
    expect(res.status).toBe(200);
  });
});
