import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import { sign, verify } from '../services/jwtService.js';
import { resetEnvCache } from '../config/env.js';
import { UnauthorizedError } from '../errors/index.js';

beforeAll(() => {
  process.env.DATABASE_URL ??= 'file:./test.db';
  process.env.JWT_SECRET ??= 'a'.repeat(32);
});

describe('jwtService', () => {
  beforeEach(() => resetEnvCache());

  it('sign + verify roundtrip', () => {
    const token = sign(123);
    expect(typeof token).toBe('string');
    expect(token.split('.')).toHaveLength(3);
    const payload = verify(token);
    expect(payload).toEqual({ userId: 123 });
  });

  it('잘못된 시크릿으로 verify → UnauthorizedError', () => {
    const token = sign(123);
    process.env.JWT_SECRET = 'b'.repeat(32);
    resetEnvCache();
    expect(() => verify(token)).toThrow(UnauthorizedError);
  });

  it('위변조된 토큰 → UnauthorizedError', () => {
    const token = sign(123);
    const tampered = token.slice(0, -5) + 'XXXXX';
    expect(() => verify(tampered)).toThrow(UnauthorizedError);
  });

  it('만료 토큰 → UnauthorizedError', async () => {
    process.env.JWT_EXP_SECONDS = '1';
    resetEnvCache();
    const token = sign(123);
    await new Promise((r) => setTimeout(r, 1500));
    expect(() => verify(token)).toThrow(UnauthorizedError);
    delete process.env.JWT_EXP_SECONDS;
    resetEnvCache();
  });

  it('비-JWT 문자열 → UnauthorizedError', () => {
    expect(() => verify('not-a-jwt')).toThrow(UnauthorizedError);
  });
});
