import { PrismaClient } from '@prisma/client';

import { getEnv } from './env.js';

let cached: PrismaClient | null = null;

export function getPrisma(): PrismaClient {
  if (cached === null) {
    cached = new PrismaClient({
      log: getEnv().LOG_LEVEL === 'debug' ? ['query', 'warn', 'error'] : ['warn', 'error'],
    });
  }
  return cached;
}

export async function disconnectPrisma(): Promise<void> {
  if (cached !== null) {
    await cached.$disconnect();
    cached = null;
  }
}
