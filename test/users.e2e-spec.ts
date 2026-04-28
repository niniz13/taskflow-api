import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { createTestApp, cleanDatabase } from './helpers/app.helper';
import { seedTestUsers } from './helpers/seed.helper';

describe('Users (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let adminToken: string;
  let memberToken: string;

  beforeAll(async () => {
    ({ app, dataSource } = await createTestApp());
  });

  beforeEach(async () => {
    await cleanDatabase(dataSource);
    await seedTestUsers(dataSource);

    const adminRes = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ email: 'admin@test.com', password: 'password123' });
    adminToken = adminRes.body.access_token;

    const memberRes = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ email: 'member@test.com', password: 'password123' });
    memberToken = memberRes.body.access_token;
  });

  afterAll(async () => {
    await dataSource.destroy();
    await app.close();
  });

  it('GET /api/users → 200 + liste non vide', async () => {
    // TODO: GET avec adminToken → 200, body est un tableau non vide
    const res = await request(app.getHttpServer())
      .get('/api/users')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('GET /api/users → 401 sans token', async () => {
    // TODO
    const res = await request(app.getHttpServer()).get('/api/users');

    expect(res.status).toBe(401);
  });

  it('POST /api/users → 201 par admin', async () => {
    // TODO:
    // - POST avec adminToken, body { email: 'new@test.com', name: 'Nouveau', password: 'Password123' }
    // - Vérifier 201, que res.body.id existe, que passwordHash n'est PAS dans la réponse
    const res = await request(app.getHttpServer())
      .post('/api/users')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        email: 'new@test.com',
        name: 'Nouveau',
        password: 'Password123',
      });

    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
  });

  it('POST /api/users → 400 email invalide', async () => {
    // TODO: body avec email malformé → expect 400
    const res = await request(app.getHttpServer())
      .post('/api/users')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ email: 'invalid-email', name: 'Test', password: 'Password123' });

    expect(res.status).toBe(400);
  });

  it('POST /api/users → 403 par member (non admin)', async () => {
    // TODO: POST avec memberToken → expect 403
    const res = await request(app.getHttpServer())
      .post('/api/users')
      .set('Authorization', `Bearer ${memberToken}`)
      .send({
        email: 'another@test.com',
        name: 'Another',
        password: 'Password123',
      });

    expect(res.status).toBe(403);
  });

  it('Cycle complet : créer → récupérer → supprimer', async () => {
    // TODO:
    // 1. POST → 201, récupérer id
    // 2. GET /api/users/:id → 200
    // 3. DELETE /api/users/:id → 204
    // 4. GET /api/users/:id → 404
    const createRes = await request(app.getHttpServer())
      .post('/api/users')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        email: 'cycle@test.com',
        name: 'Cycle Test',
        password: 'Password123',
      });

    expect(createRes.status).toBe(201);
    const userId = createRes.body.id;

    const getRes = await request(app.getHttpServer())
      .get(`/api/users/${userId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(getRes.status).toBe(200);
    expect(getRes.body.id).toBe(userId);

    const deleteRes = await request(app.getHttpServer())
      .delete(`/api/users/${userId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(deleteRes.status).toBe(204);

    const notFoundRes = await request(app.getHttpServer())
      .get(`/api/users/${userId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(notFoundRes.status).toBe(404);
  });
});
