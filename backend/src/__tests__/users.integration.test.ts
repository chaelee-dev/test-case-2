import { describe, it, expect, beforeAll, beforeEach, vi } from 'vitest';
import request from 'supertest';
import bcrypt from 'bcrypt';

import { createApp } from '../app.js';
import * as userRepo from '../repos/userRepo.js';

beforeAll(() => {
  process.env.DATABASE_URL ??= 'file:./test.db';
  process.env.JWT_SECRET ??= 'a'.repeat(32);
  process.env.BCRYPT_COST = '4';
});

beforeEach(() => vi.restoreAllMocks());

function userFixture(overrides: Partial<{ id: number; username: string; email: string; passwordHash: string }> = {}) {
  return {
    id: overrides.id ?? 1,
    username: overrides.username ?? 'u1',
    email: overrides.email ?? 'u1@e.com',
    passwordHash: overrides.passwordHash ?? '',
    bio: '',
    image: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

describe('POST /api/users', () => {
  it('정상 가입 → 200 + user 래퍼 + token', async () => {
    vi.spyOn(userRepo, 'findByUsername').mockResolvedValue(null);
    vi.spyOn(userRepo, 'findByEmail').mockResolvedValue(null);
    vi.spyOn(userRepo, 'create').mockResolvedValue(userFixture());

    const res = await request(createApp())
      .post('/api/users')
      .send({ user: { username: 'u1', email: 'u1@e.com', password: 'pw12345678' } });
    expect(res.status).toBe(200);
    expect(res.body.user).toMatchObject({ username: 'u1', email: 'u1@e.com', bio: '', image: null });
    expect(res.body.user.token).toBeTruthy();
  });

  it('중복 username → 422', async () => {
    vi.spyOn(userRepo, 'findByUsername').mockResolvedValue(userFixture());
    const res = await request(createApp())
      .post('/api/users')
      .send({ user: { username: 'u1', email: 'x@e.com', password: 'pw12345678' } });
    expect(res.status).toBe(422);
    expect(res.body).toEqual({ errors: { username: ['has already been taken'] } });
  });

  it('중복 email → 422', async () => {
    vi.spyOn(userRepo, 'findByUsername').mockResolvedValue(null);
    vi.spyOn(userRepo, 'findByEmail').mockResolvedValue(userFixture({ email: 'taken@e.com' }));
    const res = await request(createApp())
      .post('/api/users')
      .send({ user: { username: 'new', email: 'taken@e.com', password: 'pw12345678' } });
    expect(res.status).toBe(422);
    expect(res.body).toEqual({ errors: { email: ['has already been taken'] } });
  });

  it('잘못된 email 형식 → 422', async () => {
    const res = await request(createApp())
      .post('/api/users')
      .send({ user: { username: 'u', email: 'not-an-email', password: 'pw12345678' } });
    expect(res.status).toBe(422);
    expect(res.body).toEqual({ errors: { email: ['is invalid'] } });
  });

  it('body 누락 → 422', async () => {
    const res = await request(createApp()).post('/api/users').send({});
    expect(res.status).toBe(422);
  });
});

describe('POST /api/users/login', () => {
  it('정상 로그인 → 200 + token', async () => {
    const pw = 'pw12345678';
    const hash = await bcrypt.hash(pw, 4);
    vi.spyOn(userRepo, 'findByEmail').mockResolvedValue(userFixture({ passwordHash: hash }));

    const res = await request(createApp())
      .post('/api/users/login')
      .send({ user: { email: 'u1@e.com', password: pw } });
    expect(res.status).toBe(200);
    expect(res.body.user.token).toBeTruthy();
  });

  it('잘못된 password → 422 동일 메시지', async () => {
    const hash = await bcrypt.hash('correct_pw', 4);
    vi.spyOn(userRepo, 'findByEmail').mockResolvedValue(userFixture({ passwordHash: hash }));
    const res = await request(createApp())
      .post('/api/users/login')
      .send({ user: { email: 'u1@e.com', password: 'wrong_one' } });
    expect(res.status).toBe(422);
    expect(res.body).toEqual({ errors: { 'email or password': ['is invalid'] } });
  });

  it('미가입 email → 동일 422 메시지 (timing oracle 회피)', async () => {
    vi.spyOn(userRepo, 'findByEmail').mockResolvedValue(null);
    const res = await request(createApp())
      .post('/api/users/login')
      .send({ user: { email: 'never@e.com', password: 'pw12345678' } });
    expect(res.status).toBe(422);
    expect(res.body).toEqual({ errors: { 'email or password': ['is invalid'] } });
  });
});
