import { describe, it, expect, beforeAll, beforeEach, vi } from 'vitest';
import request from 'supertest';

import { createApp } from '../app.js';
import * as articleRepo from '../repos/articleRepo.js';
import * as favoriteRepo from '../repos/favoriteRepo.js';
import * as followRepo from '../repos/followRepo.js';
import * as tagRepo from '../repos/tagRepo.js';
import { sign } from '../services/jwtService.js';

beforeAll(() => {
  process.env.DATABASE_URL ??= 'file:./test.db';
  process.env.JWT_SECRET ??= 'a'.repeat(32);
});

beforeEach(() => vi.restoreAllMocks());

function articleFixture(id: number, slug: string, tagNames: string[] = []) {
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
    title: 'Hello',
    description: 'd',
    body: 'b',
    authorId: 1,
    author,
    createdAt: new Date('2026-05-15T00:00:00Z'),
    updatedAt: new Date('2026-05-15T00:00:00Z'),
    tags: tagNames.map((name, i) => ({
      articleId: id,
      tagId: 100 + i,
      tag: { id: 100 + i, name },
    })),
  };
}

describe('POST /api/articles', () => {
  it('정상 → 200 + article (slug 생성, tagList 반영)', async () => {
    vi.spyOn(articleRepo, 'existsBySlug').mockResolvedValue(false);
    vi.spyOn(tagRepo, 'ensureTags').mockResolvedValue([
      { id: 100, name: 'foo' },
      { id: 101, name: 'bar' },
    ]);
    const createSpy = vi.spyOn(articleRepo, 'create').mockResolvedValue(articleFixture(1, 'hello', ['foo', 'bar']));
    vi.spyOn(favoriteRepo, 'countByArticles').mockResolvedValue(new Map([[1, 0]]));
    vi.spyOn(favoriteRepo, 'findFavoritedArticleIds').mockResolvedValue(new Set());
    vi.spyOn(followRepo, 'exists').mockResolvedValue(false);

    const token = sign(1);
    const res = await request(createApp())
      .post('/api/articles')
      .set('Authorization', `Token ${token}`)
      .send({ article: { title: 'Hello', description: 'd', body: 'b', tagList: ['foo', 'bar'] } });

    expect(res.status).toBe(200);
    expect(res.body.article.slug).toBe('hello');
    expect(res.body.article.tagList).toEqual(['bar', 'foo']);
    expect(createSpy).toHaveBeenCalledWith(
      expect.objectContaining({ slug: 'hello', authorId: 1, tagIds: [100, 101] }),
    );
  });

  it('빈 title → 422', async () => {
    const token = sign(1);
    const res = await request(createApp())
      .post('/api/articles')
      .set('Authorization', `Token ${token}`)
      .send({ article: { title: '', description: 'd', body: 'b' } });
    expect(res.status).toBe(422);
    expect(res.body).toEqual({ errors: { title: ["can't be empty"] } });
  });

  it('인증 없음 → 401', async () => {
    const res = await request(createApp())
      .post('/api/articles')
      .send({ article: { title: 't', description: 'd', body: 'b' } });
    expect(res.status).toBe(401);
  });

  it('slug 충돌 시 suffix 적용', async () => {
    const existsSpy = vi
      .spyOn(articleRepo, 'existsBySlug')
      .mockResolvedValueOnce(true)
      .mockResolvedValueOnce(false);
    vi.spyOn(tagRepo, 'ensureTags').mockResolvedValue([]);
    const createSpy = vi.spyOn(articleRepo, 'create').mockResolvedValue(articleFixture(2, 'hello-x'));
    vi.spyOn(favoriteRepo, 'countByArticles').mockResolvedValue(new Map());
    vi.spyOn(favoriteRepo, 'findFavoritedArticleIds').mockResolvedValue(new Set());
    vi.spyOn(followRepo, 'exists').mockResolvedValue(false);

    const token = sign(1);
    const res = await request(createApp())
      .post('/api/articles')
      .set('Authorization', `Token ${token}`)
      .send({ article: { title: 'Hello', description: 'd', body: 'b' } });

    expect(res.status).toBe(200);
    expect(existsSpy).toHaveBeenCalledTimes(2);
    const createdSlug = createSpy.mock.calls[0]?.[0].slug ?? '';
    expect(createdSlug).toMatch(/^hello-[0-9a-z]{1,6}$/);
  });

  it('body 누락 → 422', async () => {
    const token = sign(1);
    const res = await request(createApp())
      .post('/api/articles')
      .set('Authorization', `Token ${token}`)
      .send({});
    expect(res.status).toBe(422);
  });
});
