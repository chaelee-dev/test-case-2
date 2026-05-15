import { describe, it, expect, beforeAll, beforeEach, vi } from 'vitest';
import request from 'supertest';

import { createApp } from '../app.js';
import * as tagRepo from '../repos/tagRepo.js';

beforeAll(() => {
  process.env.DATABASE_URL ??= 'file:./test.db';
  process.env.JWT_SECRET ??= 'a'.repeat(32);
});

beforeEach(() => vi.restoreAllMocks());

describe('GET /api/tags', () => {
  it('빈 → 200 + tags:[]', async () => {
    vi.spyOn(tagRepo, 'listAll').mockResolvedValue([]);
    const res = await request(createApp()).get('/api/tags');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ tags: [] });
  });

  it('5건 alphabetical', async () => {
    vi.spyOn(tagRepo, 'listAll').mockResolvedValue([
      'express',
      'prisma',
      'react',
      'realworld',
      'typescript',
    ]);
    const res = await request(createApp()).get('/api/tags');
    expect(res.status).toBe(200);
    expect(res.body.tags).toEqual(['express', 'prisma', 'react', 'realworld', 'typescript']);
  });
});
