import { describe, it, expect, vi } from 'vitest';
import type { NextFunction, Request, Response } from 'express';

import {
  ValidationError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
} from '../errors/index.js';
import { errorHandler } from '../middleware/errorHandler.js';

function mockRes() {
  const res = {} as Response;
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
}

describe('errorHandler 미들웨어', () => {
  it('ValidationError → 422 + field body', () => {
    const res = mockRes();
    errorHandler(new ValidationError('email', 'is invalid'), {} as Request, res, vi.fn() as NextFunction);
    expect(res.status).toHaveBeenCalledWith(422);
    expect(res.json).toHaveBeenCalledWith({ errors: { email: ['is invalid'] } });
  });

  it('UnauthorizedError → 401', () => {
    const res = mockRes();
    errorHandler(new UnauthorizedError(), {} as Request, res, vi.fn() as NextFunction);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ errors: { body: ['unauthorized'] } });
  });

  it('ForbiddenError → 403', () => {
    const res = mockRes();
    errorHandler(new ForbiddenError(), {} as Request, res, vi.fn() as NextFunction);
    expect(res.status).toHaveBeenCalledWith(403);
  });

  it('NotFoundError → 404', () => {
    const res = mockRes();
    errorHandler(new NotFoundError('x not found'), {} as Request, res, vi.fn() as NextFunction);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ errors: { body: ['x not found'] } });
  });

  it('ConflictError → 422 (409 아님)', () => {
    const res = mockRes();
    errorHandler(new ConflictError('username', 'taken'), {} as Request, res, vi.fn() as NextFunction);
    expect(res.status).toHaveBeenCalledWith(422);
    expect(res.json).toHaveBeenCalledWith({ errors: { username: ['taken'] } });
  });

  it('비-AppError → 500 + 메시지 마스킹', () => {
    const res = mockRes();
    errorHandler(new Error('DB password: secret123'), {} as Request, res, vi.fn() as NextFunction);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ errors: { body: ['internal server error'] } });
  });
});
