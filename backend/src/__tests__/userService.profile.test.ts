import { describe, it, expect, beforeAll, beforeEach, vi } from 'vitest';

import { getProfile, follow, unfollow } from '../services/userService.js';
import * as userRepo from '../repos/userRepo.js';
import * as followRepo from '../repos/followRepo.js';
import { NotFoundError, ValidationError } from '../errors/index.js';

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

describe('userService profile/follow', () => {
  it('getProfile 익명 → following=false', async () => {
    vi.spyOn(userRepo, 'findByUsername').mockResolvedValue(userFixture(2, 'target'));
    const res = await getProfile('target', null);
    expect(res.username).toBe('target');
    expect(res.following).toBe(false);
  });

  it('getProfile 미존재 → NotFoundError', async () => {
    vi.spyOn(userRepo, 'findByUsername').mockResolvedValue(null);
    await expect(getProfile('ghost', 1)).rejects.toThrowError(NotFoundError);
  });

  it('follow 정상 → following=true + create 호출', async () => {
    vi.spyOn(userRepo, 'findByUsername').mockResolvedValue(userFixture(2, 'target'));
    const createSpy = vi.spyOn(followRepo, 'create').mockResolvedValue();
    const res = await follow(1, 'target');
    expect(createSpy).toHaveBeenCalledWith(1, 2);
    expect(res.following).toBe(true);
  });

  it('self-follow → ValidationError 422', async () => {
    vi.spyOn(userRepo, 'findByUsername').mockResolvedValue(userFixture(1, 'me'));
    await expect(follow(1, 'me')).rejects.toThrowError(ValidationError);
  });

  it('unfollow → following=false + remove 호출', async () => {
    vi.spyOn(userRepo, 'findByUsername').mockResolvedValue(userFixture(2, 'target'));
    const removeSpy = vi.spyOn(followRepo, 'remove').mockResolvedValue();
    const res = await unfollow(1, 'target');
    expect(removeSpy).toHaveBeenCalledWith(1, 2);
    expect(res.following).toBe(false);
  });
});
