import { describe, it, expect, beforeAll, beforeEach, vi } from 'vitest';
import request from 'supertest';

import { createApp } from '../app.js';
import * as userRepo from '../repos/userRepo.js';
import * as followRepo from '../repos/followRepo.js';
import { sign } from '../services/jwtService.js';

beforeAll(() => {
  process.env.DATABASE_URL ??= 'file:./test.db';
  process.env.JWT_SECRET ??= 'a'.repeat(32);
});

beforeEach(() => vi.restoreAllMocks());

function userFixture(id: number, username: string) {
  return {
    id,
    username,
    email: `${username}@e.com`,
    passwordHash: '',
    bio: `bio of ${username}`,
    image: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

describe('GET /api/profiles/:username', () => {
  it('익명 → 200 + following=false', async () => {
    vi.spyOn(userRepo, 'findByUsername').mockResolvedValue(userFixture(2, 'jane'));
    const res = await request(createApp()).get('/api/profiles/jane');
    expect(res.status).toBe(200);
    expect(res.body.profile).toMatchObject({ username: 'jane', following: false });
  });

  it('미존재 → 404', async () => {
    vi.spyOn(userRepo, 'findByUsername').mockResolvedValue(null);
    const res = await request(createApp()).get('/api/profiles/ghost');
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ errors: { body: ['profile not found'] } });
  });

  it('인증 + 팔로우 중 → following=true', async () => {
    vi.spyOn(userRepo, 'findByUsername').mockResolvedValue(userFixture(2, 'jane'));
    vi.spyOn(followRepo, 'exists').mockResolvedValue(true);
    const token = sign(1);
    const res = await request(createApp()).get('/api/profiles/jane').set('Authorization', `Token ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.profile.following).toBe(true);
  });
});

describe('POST /api/profiles/:username/follow', () => {
  it('정상 → 200 + following=true', async () => {
    vi.spyOn(userRepo, 'findByUsername').mockResolvedValue(userFixture(2, 'jane'));
    vi.spyOn(followRepo, 'create').mockResolvedValue();
    const token = sign(1);
    const res = await request(createApp())
      .post('/api/profiles/jane/follow')
      .set('Authorization', `Token ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.profile.following).toBe(true);
  });

  it('self-follow → 422', async () => {
    vi.spyOn(userRepo, 'findByUsername').mockResolvedValue(userFixture(1, 'me'));
    const token = sign(1);
    const res = await request(createApp())
      .post('/api/profiles/me/follow')
      .set('Authorization', `Token ${token}`);
    expect(res.status).toBe(422);
    expect(res.body).toEqual({ errors: { body: ['cannot follow yourself'] } });
  });

  it('인증 누락 → 401', async () => {
    const res = await request(createApp()).post('/api/profiles/jane/follow');
    expect(res.status).toBe(401);
  });

  it('미존재 username → 404', async () => {
    vi.spyOn(userRepo, 'findByUsername').mockResolvedValue(null);
    const token = sign(1);
    const res = await request(createApp())
      .post('/api/profiles/ghost/follow')
      .set('Authorization', `Token ${token}`);
    expect(res.status).toBe(404);
  });
});

describe('DELETE /api/profiles/:username/follow', () => {
  it('정상 → 200 + following=false', async () => {
    vi.spyOn(userRepo, 'findByUsername').mockResolvedValue(userFixture(2, 'jane'));
    vi.spyOn(followRepo, 'remove').mockResolvedValue();
    const token = sign(1);
    const res = await request(createApp())
      .delete('/api/profiles/jane/follow')
      .set('Authorization', `Token ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.profile.following).toBe(false);
  });
});
