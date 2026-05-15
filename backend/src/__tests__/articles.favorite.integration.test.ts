import { describe, it, expect, beforeAll, beforeEach, vi } from 'vitest';
import request from 'supertest';

import { createApp } from '../app.js';
import * as articleRepo from '../repos/articleRepo.js';
import * as favoriteRepo from '../repos/favoriteRepo.js';
import * as followRepo from '../repos/followRepo.js';
import { sign } from '../services/jwtService.js';

beforeAll(() => {
  process.env.DATABASE_URL ??= 'file:./test.db';
  process.env.JWT_SECRET ??= 'a'.repeat(32);
});

beforeEach(() => vi.restoreAllMocks());

function articleFixture(id: number, slug: string) {
  const author = {
    id: 1,
    username: 'admin',
    email: 'a@e.com',
    passwordHash: '',
    bio: '',
    image: null,
    createdAt: new Date('2026-05-15T00:00:00Z'),
    updatedAt: new Date('2026-05-15T00:00:00Z'),
  };
  return {
    id,
    slug,
    title: 'T',
    description: 'd',
    body: 'b',
    authorId: 1,
    author,
    createdAt: new Date('2026-05-15T00:00:00Z'),
    updatedAt: new Date('2026-05-15T00:00:00Z'),
    tags: [],
  };
}

function commonMocks() {
  vi.spyOn(favoriteRepo, 'countByArticles').mockResolvedValue(new Map([[1, 1]]));
  vi.spyOn(favoriteRepo, 'findFavoritedArticleIds').mockResolvedValue(new Set([1]));
  vi.spyOn(followRepo, 'exists').mockResolvedValue(false);
}

describe('POST /api/articles/:slug/favorite', () => {
  it('정상 → 200 + favorited=true', async () => {
    const findSpy = vi.spyOn(articleRepo, 'findBySlug').mockResolvedValue(articleFixture(1, 'hello'));
    vi.spyOn(articleRepo, 'findById').mockResolvedValue(articleFixture(1, 'hello'));
    const createSpy = vi.spyOn(favoriteRepo, 'create').mockResolvedValue();
    commonMocks();

    const token = sign(99);
    const res = await request(createApp())
      .post('/api/articles/hello/favorite')
      .set('Authorization', `Token ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.article.favorited).toBe(true);
    expect(res.body.article.favoritesCount).toBe(1);
    expect(findSpy).toHaveBeenCalled();
    expect(createSpy).toHaveBeenCalledWith(99, 1);
  });

  it('미존재 → 404', async () => {
    vi.spyOn(articleRepo, 'findBySlug').mockResolvedValue(null);
    const token = sign(99);
    const res = await request(createApp())
      .post('/api/articles/never/favorite')
      .set('Authorization', `Token ${token}`);
    expect(res.status).toBe(404);
  });

  it('401', async () => {
    const res = await request(createApp()).post('/api/articles/hello/favorite');
    expect(res.status).toBe(401);
  });
});

describe('DELETE /api/articles/:slug/favorite', () => {
  it('정상 → 200 + favorited=false', async () => {
    vi.spyOn(articleRepo, 'findBySlug').mockResolvedValue(articleFixture(1, 'hello'));
    vi.spyOn(articleRepo, 'findById').mockResolvedValue(articleFixture(1, 'hello'));
    const removeSpy = vi.spyOn(favoriteRepo, 'remove').mockResolvedValue();
    vi.spyOn(favoriteRepo, 'countByArticles').mockResolvedValue(new Map([[1, 0]]));
    vi.spyOn(favoriteRepo, 'findFavoritedArticleIds').mockResolvedValue(new Set());
    vi.spyOn(followRepo, 'exists').mockResolvedValue(false);

    const token = sign(99);
    const res = await request(createApp())
      .delete('/api/articles/hello/favorite')
      .set('Authorization', `Token ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.article.favorited).toBe(false);
    expect(res.body.article.favoritesCount).toBe(0);
    expect(removeSpy).toHaveBeenCalledWith(99, 1);
  });

  it('idempotent — 두 번째 호출도 정상', async () => {
    vi.spyOn(articleRepo, 'findBySlug').mockResolvedValue(articleFixture(1, 'hello'));
    vi.spyOn(articleRepo, 'findById').mockResolvedValue(articleFixture(1, 'hello'));
    vi.spyOn(favoriteRepo, 'create').mockResolvedValue();
    commonMocks();
    const token = sign(99);
    await request(createApp()).post('/api/articles/hello/favorite').set('Authorization', `Token ${token}`);
    const res = await request(createApp()).post('/api/articles/hello/favorite').set('Authorization', `Token ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.article.favorited).toBe(true);
  });
});
