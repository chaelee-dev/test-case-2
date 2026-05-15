import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import type { Express, Request, Response } from 'express';

import { createApp } from '../app.js';
import { requireAuth, optionalAuth } from '../middleware/auth.js';
import { sign } from '../services/jwtService.js';

beforeAll(() => {
  process.env.DATABASE_URL ??= 'file:./test.db';
  process.env.JWT_SECRET ??= 'a'.repeat(32);
});

function makeApp(): Express {
  return createApp({
    mountExtraRoutes: (a) => {
      a.get('/protected', requireAuth, (req: Request, res: Response) => {
        res.json({ userId: req.user?.id });
      });
      a.get('/maybe', optionalAuth, (req: Request, res: Response) => {
        res.json({ userId: req.user?.id ?? null });
      });
    },
  });
}

describe('AuthMiddleware', () => {
  it('requireAuth: Token <jwt> 정상 → req.user 부착 + 200', async () => {
    const token = sign(42);
    const res = await request(makeApp()).get('/protected').set('Authorization', `Token ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ userId: 42 });
  });

  it('requireAuth: Bearer <jwt> 거부 → 401', async () => {
    const token = sign(42);
    const res = await request(makeApp()).get('/protected').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(401);
    expect(res.body).toEqual({ errors: { body: ['unauthorized'] } });
  });

  it('requireAuth: 헤더 누락 → 401', async () => {
    const res = await request(makeApp()).get('/protected');
    expect(res.status).toBe(401);
  });

  it('requireAuth: 잘못된 JWT → 401', async () => {
    const res = await request(makeApp()).get('/protected').set('Authorization', 'Token invalid.jwt.here');
    expect(res.status).toBe(401);
  });

  it('optionalAuth: 헤더 누락 → 통과 (userId null)', async () => {
    const res = await request(makeApp()).get('/maybe');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ userId: null });
  });

  it('optionalAuth: 유효 Token → userId 부착', async () => {
    const token = sign(99);
    const res = await request(makeApp()).get('/maybe').set('Authorization', `Token ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ userId: 99 });
  });

  it('optionalAuth: 잘못된 토큰 → 익명 진행 (userId null)', async () => {
    const res = await request(makeApp()).get('/maybe').set('Authorization', 'Token garbage');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ userId: null });
  });

  it('optionalAuth: Bearer prefix → 익명 (Token 아니므로)', async () => {
    const token = sign(99);
    const res = await request(makeApp()).get('/maybe').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ userId: null });
  });
});
