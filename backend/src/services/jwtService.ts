import jwt from 'jsonwebtoken';

import { getEnv } from '../config/env.js';
import { UnauthorizedError } from '../errors/index.js';

export interface JwtPayload {
  userId: number;
}

export function sign(userId: number): string {
  const env = getEnv();
  return jwt.sign({ userId } satisfies JwtPayload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXP_SECONDS,
  });
}

export function verify(token: string): JwtPayload {
  const env = getEnv();
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    if (typeof decoded !== 'object' || decoded === null || typeof decoded.userId !== 'number') {
      throw new UnauthorizedError();
    }
    return { userId: decoded.userId };
  } catch (err) {
    if (err instanceof UnauthorizedError) throw err;
    throw new UnauthorizedError();
  }
}
