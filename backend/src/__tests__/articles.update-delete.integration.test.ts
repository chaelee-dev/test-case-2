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

function articleFixture(id: number, slug: string, authorId: number, title = 'Hello', description = 'd', body = 'b') {
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
    title,
    description,
    body,
    authorId,
    author,
    createdAt: new Date('2026-05-15T00:00:00Z'),
    updatedAt: new Date('2026-05-15T00:00:00Z'),
    tags: [],
  };
}

function mountCommonMocks() {
  vi.spyOn(favoriteRepo, 'countByArticles').mockResolvedValue(new Map());
  vi.spyOn(favoriteRepo, 'findFavoritedArticleIds').mockResolvedValue(new Set());
  vi.spyOn(followRepo, 'exists').mockResolvedValue(false);
}

describe('PUT /api/articles/:slug', () => {
  it('정상 description 변경 → 200', async () => {
    vi.spyOn(articleRepo, 'findBySlug').mockResolvedValue(articleFixture(1, 'hello', 1));
    vi.spyOn(articleRepo, 'updateById').mockResolvedValue(articleFixture(1, 'hello', 1, 'Hello', 'new desc'));
    mountCommonMocks();
    const token = sign(1);
    const res = await request(createApp())
      .put('/api/articles/hello')
      .set('Authorization', `Token ${token}`)
      .send({ article: { description: 'new desc' } });
    expect(res.status).toBe(200);
    expect(res.body.article.description).toBe('new desc');
  });

  it('title 변경 → slug 재생성', async () => {
    vi.spyOn(articleRepo, 'findBySlug').mockResolvedValue(articleFixture(1, 'old-slug', 1, 'Old Title'));
    vi.spyOn(articleRepo, 'existsBySlug').mockResolvedValue(false);
    const updateSpy = vi
      .spyOn(articleRepo, 'updateById')
      .mockResolvedValue(articleFixture(1, 'new-title', 1, 'New Title'));
    mountCommonMocks();
    const token = sign(1);
    await request(createApp())
      .put('/api/articles/old-slug')
      .set('Authorization', `Token ${token}`)
      .send({ article: { title: 'New Title' } });
    expect(updateSpy).toHaveBeenCalledWith(1, expect.objectContaining({ title: 'New Title', slug: 'new-title' }));
  });

  it('타인 글 → 403', async () => {
    vi.spyOn(articleRepo, 'findBySlug').mockResolvedValue(articleFixture(1, 'hello', 2));
    const token = sign(1);
    const res = await request(createApp())
      .put('/api/articles/hello')
      .set('Authorization', `Token ${token}`)
      .send({ article: { description: 'x' } });
    expect(res.status).toBe(403);
  });

  it('미존재 → 404', async () => {
    vi.spyOn(articleRepo, 'findBySlug').mockResolvedValue(null);
    const token = sign(1);
    const res = await request(createApp())
      .put('/api/articles/never')
      .set('Authorization', `Token ${token}`)
      .send({ article: { description: 'x' } });
    expect(res.status).toBe(404);
  });

  it('empty patch → 422', async () => {
    vi.spyOn(articleRepo, 'findBySlug').mockResolvedValue(articleFixture(1, 'hello', 1));
    const token = sign(1);
    const res = await request(createApp())
      .put('/api/articles/hello')
      .set('Authorization', `Token ${token}`)
      .send({ article: {} });
    expect(res.status).toBe(422);
    expect(res.body).toEqual({ errors: { body: ['empty patch'] } });
  });
});

describe('DELETE /api/articles/:slug', () => {
  it('정상 → 200 + {}', async () => {
    vi.spyOn(articleRepo, 'findBySlug').mockResolvedValue(articleFixture(1, 'hello', 1));
    const deleteSpy = vi.spyOn(articleRepo, 'deleteById').mockResolvedValue();
    const token = sign(1);
    const res = await request(createApp()).delete('/api/articles/hello').set('Authorization', `Token ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({});
    expect(deleteSpy).toHaveBeenCalledWith(1);
  });

  it('타인 글 → 403', async () => {
    vi.spyOn(articleRepo, 'findBySlug').mockResolvedValue(articleFixture(1, 'hello', 2));
    const token = sign(1);
    const res = await request(createApp()).delete('/api/articles/hello').set('Authorization', `Token ${token}`);
    expect(res.status).toBe(403);
  });

  it('미존재 → 404', async () => {
    vi.spyOn(articleRepo, 'findBySlug').mockResolvedValue(null);
    const token = sign(1);
    const res = await request(createApp()).delete('/api/articles/never').set('Authorization', `Token ${token}`);
    expect(res.status).toBe(404);
  });
});
