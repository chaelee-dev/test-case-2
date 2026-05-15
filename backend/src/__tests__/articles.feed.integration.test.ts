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

function articleFixture(id: number, slug: string, authorId: number) {
  const author = {
    id: authorId,
    username: `user${authorId}`,
    email: `${authorId}@e.com`,
    passwordHash: '',
    bio: '',
    image: null,
    createdAt: new Date('2026-05-15T00:00:00Z'),
    updatedAt: new Date('2026-05-15T00:00:00Z'),
  };
  return {
    id,
    slug,
    title: `T-${id}`,
    description: 'd',
    body: 'b',
    authorId,
    author,
    createdAt: new Date('2026-05-15T00:00:00Z'),
    updatedAt: new Date('2026-05-15T00:00:00Z'),
    tags: [],
  };
}

describe('GET /api/articles/feed', () => {
  it('정상 — 팔로우 작가 글 2건', async () => {
    vi.spyOn(followRepo, 'findFollowedIds').mockResolvedValue([2]);
    vi.spyOn(articleRepo, 'listByAuthorIds').mockResolvedValue({
      articles: [articleFixture(10, 's1', 2), articleFixture(11, 's2', 2)],
      total: 2,
    });
    vi.spyOn(favoriteRepo, 'countByArticles').mockResolvedValue(new Map());
    vi.spyOn(favoriteRepo, 'findFavoritedArticleIds').mockResolvedValue(new Set());
    vi.spyOn(followRepo, 'exists').mockResolvedValue(true);

    const token = sign(1);
    const res = await request(createApp()).get('/api/articles/feed').set('Authorization', `Token ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.articles).toHaveLength(2);
    expect(res.body.articlesCount).toBe(2);
  });

  it('팔로우 0건 → 빈 배열', async () => {
    vi.spyOn(followRepo, 'findFollowedIds').mockResolvedValue([]);
    vi.spyOn(articleRepo, 'listByAuthorIds').mockResolvedValue({ articles: [], total: 0 });
    const token = sign(1);
    const res = await request(createApp()).get('/api/articles/feed').set('Authorization', `Token ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ articles: [], articlesCount: 0 });
  });

  it('401 (인증 없음)', async () => {
    const res = await request(createApp()).get('/api/articles/feed');
    expect(res.status).toBe(401);
  });

  it('limit=200 → 422', async () => {
    const token = sign(1);
    const res = await request(createApp())
      .get('/api/articles/feed?limit=200')
      .set('Authorization', `Token ${token}`);
    expect(res.status).toBe(422);
  });

  it('라우터 순서 — /feed가 /:slug 보다 먼저 매칭', async () => {
    vi.spyOn(followRepo, 'findFollowedIds').mockResolvedValue([]);
    vi.spyOn(articleRepo, 'listByAuthorIds').mockResolvedValue({ articles: [], total: 0 });
    const findBySlugSpy = vi.spyOn(articleRepo, 'findBySlug');
    const token = sign(1);
    const res = await request(createApp()).get('/api/articles/feed').set('Authorization', `Token ${token}`);
    expect(res.status).toBe(200);
    expect(findBySlugSpy).not.toHaveBeenCalled();
  });
});
