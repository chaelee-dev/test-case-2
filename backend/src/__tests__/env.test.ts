import { describe, it, expect, beforeEach } from 'vitest';
import { loadEnv, corsAllowList, resetEnvCache } from '../config/env.js';

describe('config/env', () => {
  beforeEach(() => resetEnvCache());

  it('정상 값 — 기본값 적용', () => {
    const env = loadEnv({
      DATABASE_URL: 'file:./test.db',
      JWT_SECRET: 'a'.repeat(32),
    });
    expect(env.NODE_ENV).toBe('development');
    expect(env.PORT).toBe(3000);
    expect(env.BCRYPT_COST).toBe(12);
    expect(env.JWT_EXP_SECONDS).toBe(86400);
  });

  it('JWT_SECRET 누락 시 throw', () => {
    expect(() => loadEnv({ DATABASE_URL: 'file:./test.db' })).toThrow(/JWT_SECRET/);
  });

  it('JWT_SECRET 길이 부족 시 throw', () => {
    expect(() =>
      loadEnv({ DATABASE_URL: 'file:./test.db', JWT_SECRET: 'short' }),
    ).toThrow(/at least 16/);
  });

  it('DATABASE_URL 누락 시 throw', () => {
    expect(() => loadEnv({ JWT_SECRET: 'a'.repeat(32) })).toThrow(/DATABASE_URL/);
  });

  it('PORT 비-숫자 시 throw', () => {
    expect(() =>
      loadEnv({ DATABASE_URL: 'x', JWT_SECRET: 'a'.repeat(32), PORT: 'not-a-port' }),
    ).toThrow();
  });

  it('CORS_ALLOW_ORIGINS 화이트리스트 파싱', () => {
    const env = loadEnv({
      DATABASE_URL: 'x',
      JWT_SECRET: 'a'.repeat(32),
      CORS_ALLOW_ORIGINS: 'http://a.com, http://b.com ,http://c.com',
    });
    expect(corsAllowList(env)).toEqual(['http://a.com', 'http://b.com', 'http://c.com']);
  });
});
