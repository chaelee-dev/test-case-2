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

function articleFixture(id: number, slug: string, authorUsername: string, tagNames: string[] = []) {
  const author = {
    id: authorUsername === 'admin' ? 1 : 2,
    username: authorUsername,
    email: `${authorUsername}@e.com`,
    passwordHash: '',
    bio: `bio of ${authorUsername}`,
    image: null,
    createdAt: new Date('2026-05-15T00:00:00Z'),
    updatedAt: new Date('2026-05-15T00:00:00Z'),
  };
  return {
    id,
    slug,
    title: `T-${slug}`,
    description: `D-${slug}`,
    body: `B-${slug}`,
    authorId: author.id,
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

describe('GET /api/articles', () => {
  it('익명 + 결과 3건 → 200 + articles[3] + articlesCount=3 (body 없음)', async () => {
    vi.spyOn(articleRepo, 'listArticles').mockResolvedValue({
      articles: [
        articleFixture(1, 'a1', 'admin', ['typescript']),
        articleFixture(2, 'a2', 'jane', ['react']),
        articleFixture(3, 'a3', 'admin', []),
      ],
      total: 3,
    });
    vi.spyOn(favoriteRepo, 'countByArticles').mockResolvedValue(new Map([[1, 5]]));
    const res = await request(createApp()).get('/api/articles');
    expect(res.status).toBe(200);
    expect(res.body.articles).toHaveLength(3);
    expect(res.body.articlesCount).toBe(3);
    expect(res.body.articles[0]).not.toHaveProperty('body');
    expect(res.body.articles[0].favoritesCount).toBe(5);
    expect(res.body.articles[0].favorited).toBe(false);
  });

  it('limit=200 → 422 must be <=100', async () => {
    const res = await request(createApp()).get('/api/articles?limit=200');
    expect(res.status).toBe(422);
    expect(res.body.errors.limit).toBeDefined();
  });

  it('offset=-1 → 422', async () => {
    const res = await request(createApp()).get('/api/articles?offset=-1');
    expect(res.status).toBe(422);
  });

  it('tag 필터 — repo에 tag 전달', async () => {
    const spy = vi.spyOn(articleRepo, 'listArticles').mockResolvedValue({ articles: [], total: 0 });
    vi.spyOn(favoriteRepo, 'countByArticles').mockResolvedValue(new Map());
    await request(createApp()).get('/api/articles?tag=typescript');
    expect(spy).toHaveBeenCalledWith(expect.objectContaining({ tag: 'typescript' }));
  });

  it('인증 + favorited 1건 → 해당 article favorited=true', async () => {
    vi.spyOn(articleRepo, 'listArticles').mockResolvedValue({
      articles: [articleFixture(1, 'a1', 'admin', ['typescript'])],
      total: 1,
    });
    vi.spyOn(favoriteRepo, 'countByArticles').mockResolvedValue(new Map([[1, 1]]));
    vi.spyOn(favoriteRepo, 'findFavoritedArticleIds').mockResolvedValue(new Set([1]));
    vi.spyOn(followRepo, 'exists').mockResolvedValue(false);
    const token = sign(99);
    const res = await request(createApp()).get('/api/articles').set('Authorization', `Token ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.articles[0].favorited).toBe(true);
  });
});

describe('GET /api/articles/:slug', () => {
  it('정상 → 200 + body 포함', async () => {
    vi.spyOn(articleRepo, 'findBySlug').mockResolvedValue(
      articleFixture(1, 'how-to-conduit', 'admin', ['typescript', 'realworld']),
    );
    vi.spyOn(favoriteRepo, 'countByArticles').mockResolvedValue(new Map([[1, 0]]));
    const res = await request(createApp()).get('/api/articles/how-to-conduit');
    expect(res.status).toBe(200);
    expect(res.body.article).toMatchObject({
      slug: 'how-to-conduit',
      title: 'T-how-to-conduit',
      body: 'B-how-to-conduit',
      favoritesCount: 0,
    });
    expect(res.body.article.tagList).toEqual(['realworld', 'typescript']);
  });

  it('미존재 → 404', async () => {
    vi.spyOn(articleRepo, 'findBySlug').mockResolvedValue(null);
    const res = await request(createApp()).get('/api/articles/never-exists');
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ errors: { body: ['article not found'] } });
  });

  it('인증 + 본인 article → favorited 계산', async () => {
    vi.spyOn(articleRepo, 'findBySlug').mockResolvedValue(articleFixture(1, 's', 'admin'));
    vi.spyOn(favoriteRepo, 'countByArticles').mockResolvedValue(new Map([[1, 0]]));
    vi.spyOn(favoriteRepo, 'findFavoritedArticleIds').mockResolvedValue(new Set([1]));
    vi.spyOn(followRepo, 'exists').mockResolvedValue(false);
    const token = sign(99);
    const res = await request(createApp()).get('/api/articles/s').set('Authorization', `Token ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.article.favorited).toBe(true);
  });
});
