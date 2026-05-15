import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { getPrisma, disconnectPrisma } from '../config/prisma.js';

beforeAll(() => {
  process.env.DATABASE_URL ??= 'file:./test.db';
  process.env.JWT_SECRET ??= 'a'.repeat(32);
});

afterAll(async () => {
  await disconnectPrisma();
});

describe('PrismaClient singleton', () => {
  it('getPrisma()는 동일 인스턴스 반환', () => {
    const a = getPrisma();
    const b = getPrisma();
    expect(a).toBe(b);
  });

  it('disconnect 후 다시 호출하면 새 인스턴스', async () => {
    const a = getPrisma();
    await disconnectPrisma();
    const b = getPrisma();
    expect(a).not.toBe(b);
  });
});
