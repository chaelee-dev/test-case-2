import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import type { Express, Request, Response, NextFunction } from 'express';

import { createApp } from '../app.js';
import {
  ValidationError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
} from '../errors/index.js';

describe('app 통합 — 5 도메인 에러 + InternalError 매핑', () => {
  let app: Express;

  beforeAll(() => {
    process.env.DATABASE_URL ??= 'file:./test.db';
    process.env.JWT_SECRET ??= 'a'.repeat(32);
    app = createApp({
      mountExtraRoutes: (a) => {
        a.get('/_test/validation', (_req: Request, _res: Response, next: NextFunction) =>
          next(new ValidationError('email', 'is invalid')),
        );
        a.get('/_test/unauth', (_req: Request, _res: Response, next: NextFunction) =>
          next(new UnauthorizedError()),
        );
        a.get('/_test/forbidden', (_req: Request, _res: Response, next: NextFunction) =>
          next(new ForbiddenError()),
        );
        a.get('/_test/notfound', (_req: Request, _res: Response, next: NextFunction) =>
          next(new NotFoundError('article not found')),
        );
        a.get('/_test/conflict', (_req: Request, _res: Response, next: NextFunction) =>
          next(new ConflictError('username', 'has already been taken')),
        );
        a.get('/_test/internal', (_req: Request, _res: Response, next: NextFunction) =>
          next(new Error('DB password: secret')),
        );
      },
    });
  });

  it('/health 200 (회귀)', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });

  it('ValidationError 라우트 → 422', async () => {
    const res = await request(app).get('/_test/validation');
    expect(res.status).toBe(422);
    expect(res.body).toEqual({ errors: { email: ['is invalid'] } });
  });

  it('UnauthorizedError → 401', async () => {
    const res = await request(app).get('/_test/unauth');
    expect(res.status).toBe(401);
    expect(res.body).toEqual({ errors: { body: ['unauthorized'] } });
  });

  it('ForbiddenError → 403', async () => {
    const res = await request(app).get('/_test/forbidden');
    expect(res.status).toBe(403);
  });

  it('NotFoundError → 404', async () => {
    const res = await request(app).get('/_test/notfound');
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ errors: { body: ['article not found'] } });
  });

  it('ConflictError → 422 (409 아님)', async () => {
    const res = await request(app).get('/_test/conflict');
    expect(res.status).toBe(422);
    expect(res.body).toEqual({ errors: { username: ['has already been taken'] } });
  });

  it('비-AppError → 500 + 메시지 마스킹', async () => {
    const res = await request(app).get('/_test/internal');
    expect(res.status).toBe(500);
    expect(res.body).toEqual({ errors: { body: ['internal server error'] } });
    expect(JSON.stringify(res.body)).not.toContain('secret');
  });
});
