import { describe, it, expect, beforeAll, beforeEach, vi } from 'vitest';
import request from 'supertest';

import { createApp } from '../app.js';
import * as articleRepo from '../repos/articleRepo.js';
import * as commentRepo from '../repos/commentRepo.js';
import * as followRepo from '../repos/followRepo.js';
import { sign } from '../services/jwtService.js';

beforeAll(() => {
  process.env.DATABASE_URL ??= 'file:./test.db';
  process.env.JWT_SECRET ??= 'a'.repeat(32);
});

beforeEach(() => vi.restoreAllMocks());

function articleFixture(authorId = 1) {
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
    id: 100,
    slug: 'hello',
    title: 'T',
    description: 'd',
    body: 'b',
    authorId,
    author,
    createdAt: new Date('2026-05-15T00:00:00Z'),
    updatedAt: new Date('2026-05-15T00:00:00Z'),
    tags: [],
  };
}

function commentFixture(id: number, articleId: number, authorId: number, body = 'hi') {
  return {
    id,
    articleId,
    authorId,
    body,
    createdAt: new Date('2026-05-15T00:00:00Z'),
    updatedAt: new Date('2026-05-15T00:00:00Z'),
    author: {
      id: authorId,
      username: `user${authorId}`,
      email: `${authorId}@e.com`,
      passwordHash: '',
      bio: '',
      image: null,
      createdAt: new Date('2026-05-15T00:00:00Z'),
      updatedAt: new Date('2026-05-15T00:00:00Z'),
    },
  };
}

describe('GET /api/articles/:slug/comments', () => {
  it('빈 목록 → 200 + comments:[]', async () => {
    vi.spyOn(articleRepo, 'findBySlug').mockResolvedValue(articleFixture(1));
    vi.spyOn(commentRepo, 'listByArticleId').mockResolvedValue([]);
    const res = await request(createApp()).get('/api/articles/hello/comments');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ comments: [] });
  });

  it('미존재 article → 404', async () => {
    vi.spyOn(articleRepo, 'findBySlug').mockResolvedValue(null);
    const res = await request(createApp()).get('/api/articles/never/comments');
    expect(res.status).toBe(404);
  });

  it('comments 3건', async () => {
    vi.spyOn(articleRepo, 'findBySlug').mockResolvedValue(articleFixture(1));
    vi.spyOn(commentRepo, 'listByArticleId').mockResolvedValue([
      commentFixture(1, 100, 2, 'c1'),
      commentFixture(2, 100, 3, 'c2'),
      commentFixture(3, 100, 2, 'c3'),
    ]);
    vi.spyOn(followRepo, 'exists').mockResolvedValue(false);
    const res = await request(createApp()).get('/api/articles/hello/comments');
    expect(res.status).toBe(200);
    expect(res.body.comments).toHaveLength(3);
  });
});

describe('POST /api/articles/:slug/comments', () => {
  it('정상 → 200 + comment', async () => {
    vi.spyOn(articleRepo, 'findBySlug').mockResolvedValue(articleFixture(1));
    vi.spyOn(commentRepo, 'create').mockResolvedValue(commentFixture(10, 100, 2, 'hi'));
    vi.spyOn(followRepo, 'exists').mockResolvedValue(false);
    const token = sign(2);
    const res = await request(createApp())
      .post('/api/articles/hello/comments')
      .set('Authorization', `Token ${token}`)
      .send({ comment: { body: 'hi' } });
    expect(res.status).toBe(200);
    expect(res.body.comment.body).toBe('hi');
  });

  it('빈 body → 422', async () => {
    const token = sign(2);
    const res = await request(createApp())
      .post('/api/articles/hello/comments')
      .set('Authorization', `Token ${token}`)
      .send({ comment: { body: '' } });
    expect(res.status).toBe(422);
  });

  it('미존재 article → 404', async () => {
    vi.spyOn(articleRepo, 'findBySlug').mockResolvedValue(null);
    const token = sign(2);
    const res = await request(createApp())
      .post('/api/articles/never/comments')
      .set('Authorization', `Token ${token}`)
      .send({ comment: { body: 'hi' } });
    expect(res.status).toBe(404);
  });

  it('401', async () => {
    const res = await request(createApp())
      .post('/api/articles/hello/comments')
      .send({ comment: { body: 'hi' } });
    expect(res.status).toBe(401);
  });
});

describe('DELETE /api/articles/:slug/comments/:id', () => {
  it('본인 댓글 → 200', async () => {
    vi.spyOn(articleRepo, 'findBySlug').mockResolvedValue(articleFixture(1));
    vi.spyOn(commentRepo, 'findById').mockResolvedValue(commentFixture(10, 100, 2));
    const deleteSpy = vi.spyOn(commentRepo, 'deleteById').mockResolvedValue();
    const token = sign(2);
    const res = await request(createApp())
      .delete('/api/articles/hello/comments/10')
      .set('Authorization', `Token ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({});
    expect(deleteSpy).toHaveBeenCalledWith(10);
  });

  it('글 작성자 권한 (남 댓글 삭제) → 200', async () => {
    vi.spyOn(articleRepo, 'findBySlug').mockResolvedValue(articleFixture(1));
    vi.spyOn(commentRepo, 'findById').mockResolvedValue(commentFixture(10, 100, 2));
    vi.spyOn(commentRepo, 'deleteById').mockResolvedValue();
    const token = sign(1); // article 작성자 = 1
    const res = await request(createApp())
      .delete('/api/articles/hello/comments/10')
      .set('Authorization', `Token ${token}`);
    expect(res.status).toBe(200);
  });

  it('타인 댓글 (글 작성자 아님) → 403', async () => {
    vi.spyOn(articleRepo, 'findBySlug').mockResolvedValue(articleFixture(1));
    vi.spyOn(commentRepo, 'findById').mockResolvedValue(commentFixture(10, 100, 2));
    const token = sign(99);
    const res = await request(createApp())
      .delete('/api/articles/hello/comments/10')
      .set('Authorization', `Token ${token}`);
    expect(res.status).toBe(403);
  });

  it('미존재 comment → 404', async () => {
    vi.spyOn(articleRepo, 'findBySlug').mockResolvedValue(articleFixture(1));
    vi.spyOn(commentRepo, 'findById').mockResolvedValue(null);
    const token = sign(2);
    const res = await request(createApp())
      .delete('/api/articles/hello/comments/999')
      .set('Authorization', `Token ${token}`);
    expect(res.status).toBe(404);
  });
});
