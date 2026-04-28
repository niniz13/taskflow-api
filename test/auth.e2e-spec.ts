import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { createTestApp, cleanDatabase } from './helpers/app.helper';
import { seedTestUsers } from './helpers/seed.helper';

describe('Auth (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let accessToken: string;

  beforeAll(async () => {
    ({ app, dataSource } = await createTestApp());
  });

  beforeEach(async () => {
    await cleanDatabase(dataSource);
    await seedTestUsers(dataSource);
  });

  afterAll(async () => {
    await dataSource.destroy();
    await app.close();
  });

  describe('POST /api/auth/login', () => {
    it('200 + token avec les bons credentials', async () => {
      // TODO:
      // - POST /api/auth/login avec email: 'admin@test.com', password: 'password123'
      // - Vérifier status 200
      // - Vérifier que res.body contient 'access_token' (string)
      // - Vérifier que res.body.user.email === 'admin@test.com'
      const res = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ email: 'admin@test.com', password: 'password123' });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('access_token');
      expect(typeof res.body.access_token).toBe('string');
      expect(res.body.user.email).toBe('admin@test.com');
    });

    it('401 avec mauvais mot de passe', async () => {
      // TODO: même email, password: 'wrong' → expect 401
      const res = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ email: 'admin@test.com', password: 'wrong' });

      expect(res.status).toBe(401);
    });

    it('401 avec email inconnu', async () => {
      // TODO: email: 'nobody@test.com' → expect 401
      const res = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ email: 'nobody@test.com', password: 'password123' });

      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/auth/me', () => {
    beforeEach(async () => {
      const res = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ email: 'admin@test.com', password: 'password123' });
      accessToken = res.body.access_token;
    });

    it('200 + profil connecté', async () => {
      // TODO:
      // - GET /api/auth/me avec Authorization: Bearer {{accessToken}}
      // - Vérifier status 200
      // - Vérifier que res.body.email === 'admin@test.com'
      const res = await request(app.getHttpServer())
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).toBe(200);
      expect(res.body.email).toBe('admin@test.com');
    });

    it('401 sans token', async () => {
      // TODO: GET /api/auth/me sans header → expect 401
      const res = await request(app.getHttpServer()).get('/api/auth/me');

      expect(res.status).toBe(401);
    });
  });
});
