import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app';
import { prisma } from '../src/config/db';

const app = createApp();

describe('🔐 Auth & RBAC Security Suite', () => {
  beforeAll(async () => {
    // Setup test database
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should reject login with invalid credentials', async () => {
    const res = await request(app).post('/api/v1/auth/login').send({
      identifier: 'admin@dayflow.internal',
      password: 'WrongPassword999!',
    });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('UNAUTHORIZED');
  });

  it('should successfully authenticate admin user and return JWT + Refresh Token', async () => {
    const res = await request(app).post('/api/v1/auth/login').send({
      identifier: 'admin@dayflow.internal',
      password: 'Password@123',
    });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.tokens.accessToken).toBeDefined();
    expect(res.body.data.tokens.refreshToken).toBeDefined();
    expect(res.body.data.user.role).toBe('ADMIN');
  });

  it('should authenticate standard employee and verify access to /auth/me', async () => {
    const loginRes = await request(app).post('/api/v1/auth/login').send({
      identifier: 'alex.chen@dayflow.internal',
      password: 'Password@123',
    });

    expect(loginRes.status).toBe(200);
    const token = loginRes.body.data.tokens.accessToken;

    const meRes = await request(app)
      .get('/api/v1/auth/me')
      .set('Authorization', `Bearer ${token}`);

    expect(meRes.status).toBe(200);
    expect(meRes.body.data.email).toBe('alex.chen@dayflow.internal');
    expect(meRes.body.data.profile.department).toBe('ENGINEERING');
  });

  it('should reject unauthenticated requests to protected routes with 401', async () => {
    const res = await request(app).get('/api/v1/employees');
    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe('UNAUTHORIZED');
  });

  it('should enforce RBAC: Employee cannot access /api/v1/audit-logs (403 Forbidden)', async () => {
    const loginRes = await request(app).post('/api/v1/auth/login').send({
      identifier: 'alex.chen@dayflow.internal',
      password: 'Password@123',
    });
    const token = loginRes.body.data.tokens.accessToken;

    const auditRes = await request(app)
      .get('/api/v1/audit-logs')
      .set('Authorization', `Bearer ${token}`);

    expect(auditRes.status).toBe(403);
    expect(auditRes.body.error.code).toBe('FORBIDDEN');
  });

  it('should rotate refresh token and revoke used one', async () => {
    const loginRes = await request(app).post('/api/v1/auth/login').send({
      identifier: 'hr@dayflow.internal',
      password: 'Password@123',
    });

    const initialRefreshToken = loginRes.body.data.tokens.refreshToken;

    // Use refresh token
    const refreshRes = await request(app).post('/api/v1/auth/refresh-token').send({
      refreshToken: initialRefreshToken,
    });

    expect(refreshRes.status).toBe(200);
    expect(refreshRes.body.data.tokens.accessToken).toBeDefined();
    expect(refreshRes.body.data.tokens.refreshToken).toBeDefined();
    expect(refreshRes.body.data.tokens.refreshToken).not.toBe(initialRefreshToken);

    // Reusing the old revoked token must fail with 401
    const reuseRes = await request(app).post('/api/v1/auth/refresh-token').send({
      refreshToken: initialRefreshToken,
    });

    expect(reuseRes.status).toBe(401);
  });
});
