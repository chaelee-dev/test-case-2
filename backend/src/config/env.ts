import { z } from 'zod';

const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(3000),
  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(16, 'JWT_SECRET must be at least 16 chars'),
  JWT_EXP_SECONDS: z.coerce.number().int().positive().default(86400),
  BCRYPT_COST: z.coerce.number().int().min(4).max(15).default(12),
  CORS_ALLOW_ORIGINS: z.string().default('http://localhost:5173'),
  MAX_PAGE_LIMIT: z.coerce.number().int().positive().default(100),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),
});

export type Env = z.infer<typeof EnvSchema>;

let cached: Env | null = null;

export function loadEnv(source: Record<string, string | undefined> = process.env): Env {
  const parsed = EnvSchema.safeParse(source);
  if (!parsed.success) {
    const issues = parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ');
    throw new Error(`Environment validation failed — ${issues}`);
  }
  return parsed.data;
}

export function getEnv(): Env {
  if (cached === null) cached = loadEnv();
  return cached;
}

export function resetEnvCache(): void {
  cached = null;
}

export function corsAllowList(env: Env = getEnv()): string[] {
  return env.CORS_ALLOW_ORIGINS.split(',')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}
