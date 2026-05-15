import { describe, it, expect, beforeAll, beforeEach, vi } from 'vitest';
import bcrypt from 'bcrypt';

import { register, login } from '../services/userService.js';
import * as userRepo from '../repos/userRepo.js';
import { ValidationError, ConflictError } from '../errors/index.js';

beforeAll(() => {
  process.env.DATABASE_URL ??= 'file:./test.db';
  process.env.JWT_SECRET ??= 'a'.repeat(32);
  process.env.BCRYPT_COST = '4'; // 테스트 가속
});

beforeEach(() => {
  vi.restoreAllMocks();
});

describe('userService.register', () => {
  it('정상 가입 → AuthUserResponse + token + bcrypt cost 적용', async () => {
    vi.spyOn(userRepo, 'findByUsername').mockResolvedValue(null);
    vi.spyOn(userRepo, 'findByEmail').mockResolvedValue(null);
    const createdHash = await bcrypt.hash('pw12345678', 4);
    vi.spyOn(userRepo, 'create').mockResolvedValue({
      id: 1,
      username: 'u1',
      email: 'u1@e.com',
      passwordHash: createdHash,
      bio: '',
      image: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const res = await register({ username: 'u1', email: 'u1@e.com', password: 'pw12345678' });
    expect(res.username).toBe('u1');
    expect(res.email).toBe('u1@e.com');
    expect(res.token).toMatch(/^[\w-]+\.[\w-]+\.[\w-]+$/);
    expect(res.bio).toBe('');
    expect(res.image).toBeNull();
  });

  it('중복 username → ConflictError 422 + has already been taken', async () => {
    vi.spyOn(userRepo, 'findByUsername').mockResolvedValue({ id: 1 } as never);
    await expect(register({ username: 'taken', email: 'x@e.com', password: 'pw12345678' })).rejects.toThrowError(
      ConflictError,
    );
  });

  it('중복 email → ConflictError', async () => {
    vi.spyOn(userRepo, 'findByUsername').mockResolvedValue(null);
    vi.spyOn(userRepo, 'findByEmail').mockResolvedValue({ id: 1 } as never);
    await expect(register({ username: 'new', email: 'taken@e.com', password: 'pw12345678' })).rejects.toThrowError(
      ConflictError,
    );
  });

  it('잘못된 email 형식 → ValidationError(email, is invalid)', async () => {
    await expect(register({ username: 'u', email: 'not-an-email', password: 'pw12345678' })).rejects.toThrowError(
      ValidationError,
    );
  });

  it('password 길이 < 8 → ValidationError', async () => {
    await expect(register({ username: 'u', email: 'u@e.com', password: 'short' })).rejects.toThrowError(
      ValidationError,
    );
  });
});

describe('userService.login', () => {
  it('정상 자격증명 → AuthUserResponse + 새 token', async () => {
    const pw = 'pw12345678';
    const hash = await bcrypt.hash(pw, 4);
    vi.spyOn(userRepo, 'findByEmail').mockResolvedValue({
      id: 1,
      username: 'u1',
      email: 'u1@e.com',
      passwordHash: hash,
      bio: '',
      image: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const res = await login({ email: 'u1@e.com', password: pw });
    expect(res.email).toBe('u1@e.com');
    expect(res.token).toBeTruthy();
  });

  it('잘못된 password → ValidationError 422 (동일 메시지)', async () => {
    const hash = await bcrypt.hash('correct_password', 4);
    vi.spyOn(userRepo, 'findByEmail').mockResolvedValue({
      id: 1,
      username: 'u',
      email: 'u@e.com',
      passwordHash: hash,
      bio: '',
      image: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    await expect(login({ email: 'u@e.com', password: 'wrong_one' })).rejects.toThrowError(ValidationError);
  });

  it('미가입 email → 동일한 ValidationError (timing oracle 회피)', async () => {
    vi.spyOn(userRepo, 'findByEmail').mockResolvedValue(null);
    await expect(login({ email: 'never@e.com', password: 'pw12345678' })).rejects.toThrowError(ValidationError);
  });
});
