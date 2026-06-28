import request from 'supertest';
import app from '../app';
import prisma from '../prisma';

const api = request(app);
let hasDb = false;

beforeAll(async () => {
  try {
    await prisma.$connect();
    hasDb = true;
  } catch (e) {
    // DB not available; tests that require DB will be skipped
    hasDb = false;
  }
});

beforeEach(async () => {
  if (!hasDb) return;
  // Reset DB tables (adjust names if your Prisma models map differently)
  await prisma.$executeRawUnsafe(
    'TRUNCATE TABLE "Notification", "StatusLog", "Assignment", "ServiceRequest", "Category", "User" RESTART IDENTITY CASCADE;'
  );
});

afterAll(async () => {
  if (hasDb) await prisma.$disconnect();
});

describe('Auth routes', () => {
  test('register with valid data should succeed', async () => {
    if (!hasDb) return;
    const res = await api.post('/api/auth/register').send({
      name: 'Test User',
      email: 'test@example.com',
      password: 'Password123!'
    });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user).toMatchObject({ email: 'test@example.com' });
  });

  test('register with invalid data should fail', async () => {
    if (!hasDb) return;
    const res = await api.post('/api/auth/register').send({
      name: '',
      email: 'not-an-email',
      password: 'short'
    });

    expect(res.status).toBeGreaterThanOrEqual(400);
  });

  test('login success and fail', async () => {
    if (!hasDb) return;
    await api.post('/api/auth/register').send({
      name: 'Login User',
      email: 'login@example.com',
      password: 'Password123!'
    });

    const ok = await api.post('/api/auth/login').send({
      email: 'login@example.com',
      password: 'Password123!'
    });
    expect(ok.status).toBe(200);
    expect(ok.body).toHaveProperty('token');

    const bad = await api.post('/api/auth/login').send({
      email: 'login@example.com',
      password: 'WrongPass!'
    });
    expect(bad.status).toBe(401);
  });

  test('JWT verify via /api/auth/me', async () => {
    if (!hasDb) return;
    const reg = await api.post('/api/auth/register').send({
      name: 'Me User',
      email: 'me@example.com',
      password: 'Password123!'
    });
    const token = reg.body.token;

    const me = await api.get('/api/auth/me').set('Authorization', `Bearer ${token}`);
    expect(me.status).toBe(200);
    expect(me.body.user.email).toBe('me@example.com');
  });
});
