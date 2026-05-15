import type { RequestHandler } from 'express';

import { UnauthorizedError } from '../errors/index.js';
import { verify } from '../services/jwtService.js';

declare module 'express-serve-static-core' {
  interface Request {
    user?: { id: number };
  }
}

const TOKEN_PREFIX = 'Token ';

function extractToken(authHeader: string | undefined): string | null {
  if (!authHeader) return null;
  // RealWorld 사양: `Token <jwt>` 만 허용. `Bearer <jwt>`는 거부 (RISK-02 완화).
  if (!authHeader.startsWith(TOKEN_PREFIX)) return null;
  return authHeader.slice(TOKEN_PREFIX.length).trim() || null;
}

export const requireAuth: RequestHandler = (req, _res, next) => {
  const token = extractToken(req.header('Authorization'));
  if (!token) {
    next(new UnauthorizedError());
    return;
  }
  try {
    const payload = verify(token);
    req.user = { id: payload.userId };
    next();
  } catch (err) {
    next(err);
  }
};

export const optionalAuth: RequestHandler = (req, _res, next) => {
  const token = extractToken(req.header('Authorization'));
  if (!token) {
    next();
    return;
  }
  try {
    const payload = verify(token);
    req.user = { id: payload.userId };
    next();
  } catch (_err) {
    // optionalAuth: 토큰 형식이 잘못되어도 익명으로 진행
    next();
  }
};
