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
    hasDb = false;
  }
});

beforeEach(async () => {
  if (!hasDb) return;
  await prisma.$executeRawUnsafe(
    'TRUNCATE TABLE "Notification", "StatusLog", "Assignment", "ServiceRequest", "Category", "User" RESTART IDENTITY CASCADE;'
  );
});

afterAll(async () => {
  if (hasDb) await prisma.$disconnect();
});

describe('Service requests', () => {
  test('create request and list with pagination', async () => {
    if (!hasDb) return;
    // create user
    const reg = await api.post('/api/auth/register').send({
      name: 'Req User',
      email: 'req@example.com',
      password: 'Password123!'
    });
    const token = reg.body.token;

    const catRes = await prisma.category.create({ data: { name: 'Electrical' } });

    const create = await api.post('/api/requests').set('Authorization', `Bearer ${token}`).send({
      title: 'Broken light',
      description: 'Light not working',
      categoryId: catRes.id,
      location: 'Building A',
      priority: 'MEDIUM'
    });
    expect(create.status).toBe(201);

    const list = await api.get('/api/requests').set('Authorization', `Bearer ${token}`).query({ page: 1, limit: 10 });
    expect(list.status).toBe(200);
    expect(Array.isArray(list.body.data)).toBe(true);
  });

  test('assign officer and status update with role checks', async () => {
    if (!hasDb) return;
    // create admin
    const adminReg = await api.post('/api/auth/register').send({ name: 'Admin', email: 'admin@example.com', password: 'Password123!', role: 'ADMIN' });
    const adminToken = adminReg.body.token;

    // create officer
    const officerReg = await api.post('/api/auth/register').send({ name: 'Officer', email: 'officer@example.com', password: 'Password123!', role: 'OFFICER' });
    const officer = officerReg.body.user;

    // create category and request
    const cat = await prisma.category.create({ data: { name: 'Plumbing' } });
    const userReg = await api.post('/api/auth/register').send({ name: 'Stu', email: 'stu@example.com', password: 'Password123!' });
    const userToken = userReg.body.token;

    const reqRes = await api.post('/api/requests').set('Authorization', `Bearer ${userToken}`).send({
      title: 'Leak',
      description: 'Pipe leaking',
      categoryId: cat.id,
      location: 'Dorm 1',
      priority: 'HIGH'
    });
    const reqId = reqRes.body.id;

    // admin assigns officer
    const assign = await api.post(`/api/admin/requests/${reqId}/assign`).set('Authorization', `Bearer ${adminToken}`).send({ officerId: officer.id });
    expect(assign.status).toBe(200);

    // officer updates status
    const offLogin = await api.post('/api/auth/login').send({ email: 'officer@example.com', password: 'Password123!' });
    const offToken = offLogin.body.token;
    const update = await api.patch(`/api/requests/${reqId}`).set('Authorization', `Bearer ${offToken}`).send({ status: 'IN_PROGRESS' });
    expect(update.status).toBe(200);
  });
});
