import { describe, it, expect, beforeAll, beforeEach, vi } from 'vitest';
import request from 'supertest';
import bcrypt from 'bcrypt';

import { createApp } from '../app.js';
import * as userRepo from '../repos/userRepo.js';
import { sign } from '../services/jwtService.js';

beforeAll(() => {
  process.env.DATABASE_URL ??= 'file:./test.db';
  process.env.JWT_SECRET ??= 'a'.repeat(32);
  process.env.BCRYPT_COST = '4';
});

beforeEach(() => vi.restoreAllMocks());

function userFixture(overrides: Partial<{
  id: number;
  username: string;
  email: string;
  passwordHash: string;
  bio: string;
  image: string | null;
}> = {}) {
  return {
    id: overrides.id ?? 1,
    username: overrides.username ?? 'u1',
    email: overrides.email ?? 'u1@e.com',
    passwordHash: overrides.passwordHash ?? '',
    bio: overrides.bio ?? '',
    image: overrides.image ?? null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

describe('GET /api/user', () => {
  it('정상 토큰 → 200 + user', async () => {
    vi.spyOn(userRepo, 'findById').mockResolvedValue(userFixture({ bio: 'hello' }));
    const token = sign(1);
    const res = await request(createApp()).get('/api/user').set('Authorization', `Token ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.user).toMatchObject({ username: 'u1', email: 'u1@e.com', bio: 'hello' });
    expect(res.body.user.token).toBeTruthy();
  });

  it('헤더 누락 → 401', async () => {
    const res = await request(createApp()).get('/api/user');
    expect(res.status).toBe(401);
  });

  it('Bearer prefix → 401', async () => {
    const token = sign(1);
    const res = await request(createApp()).get('/api/user').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(401);
  });
});

describe('PUT /api/user', () => {
  it('부분 갱신 (bio) → 200', async () => {
    const existing = userFixture({ bio: 'old' });
    vi.spyOn(userRepo, 'findById').mockResolvedValue(existing);
    vi.spyOn(userRepo, 'update').mockResolvedValue({ ...existing, bio: 'new bio' });
    const token = sign(1);
    const res = await request(createApp())
      .put('/api/user')
      .set('Authorization', `Token ${token}`)
      .send({ user: { bio: 'new bio' } });
    expect(res.status).toBe(200);
    expect(res.body.user.bio).toBe('new bio');
  });

  it('화이트리스트 — id·isAdmin 무시', async () => {
    const existing = userFixture({ bio: 'old' });
    vi.spyOn(userRepo, 'findById').mockResolvedValue(existing);
    const updateSpy = vi.spyOn(userRepo, 'update').mockResolvedValue({ ...existing, bio: 'new' });
    const token = sign(1);
    await request(createApp())
      .put('/api/user')
      .set('Authorization', `Token ${token}`)
      .send({ user: { bio: 'new', id: 999, isAdmin: true } });
    expect(updateSpy).toHaveBeenCalledWith(1, expect.not.objectContaining({ id: 999 }));
  });

  it('중복 email → 422', async () => {
    const existing = userFixture({ email: 'mine@e.com' });
    vi.spyOn(userRepo, 'findById').mockResolvedValue(existing);
    vi.spyOn(userRepo, 'findByEmail').mockResolvedValue(userFixture({ id: 2, email: 'taken@e.com' }));
    const token = sign(1);
    const res = await request(createApp())
      .put('/api/user')
      .set('Authorization', `Token ${token}`)
      .send({ user: { email: 'taken@e.com' } });
    expect(res.status).toBe(422);
    expect(res.body).toEqual({ errors: { email: ['has already been taken'] } });
  });

  it('PUT password "" 비움 → 미변경 (OQ-D3)', async () => {
    const oldHash = await bcrypt.hash('old_password', 4);
    const existing = userFixture({ passwordHash: oldHash });
    vi.spyOn(userRepo, 'findById').mockResolvedValue(existing);
    const updateSpy = vi.spyOn(userRepo, 'update').mockResolvedValue(existing);
    const token = sign(1);
    await request(createApp())
      .put('/api/user')
      .set('Authorization', `Token ${token}`)
      .send({ user: { password: '' } });
    // password 비움 + 다른 필드 변경 없음 → update 호출 안 됨
    expect(updateSpy).not.toHaveBeenCalled();
  });

  it('PUT 401 (Bearer)', async () => {
    const token = sign(1);
    const res = await request(createApp())
      .put('/api/user')
      .set('Authorization', `Bearer ${token}`)
      .send({ user: { bio: 'x' } });
    expect(res.status).toBe(401);
  });
});
