import { describe, it, expect } from 'vitest';
import {
  ValidationError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  InternalError,
  AppError,
} from '../errors/index.js';

describe('도메인 에러 클래스', () => {
  it('ValidationError → 422 + field별 body', () => {
    const e = new ValidationError('email', 'is invalid');
    expect(e.statusCode).toBe(422);
    expect(e.name).toBe('ValidationError');
    expect(e.toBody()).toEqual({ errors: { email: ['is invalid'] } });
  });

  it('UnauthorizedError → 401 + body 키', () => {
    const e = new UnauthorizedError();
    expect(e.statusCode).toBe(401);
    expect(e.toBody()).toEqual({ errors: { body: ['unauthorized'] } });
  });

  it('ForbiddenError → 403', () => {
    const e = new ForbiddenError();
    expect(e.statusCode).toBe(403);
    expect(e.toBody()).toEqual({ errors: { body: ['forbidden'] } });
  });

  it('NotFoundError → 404 + 사용자 메시지', () => {
    const e = new NotFoundError('article not found');
    expect(e.statusCode).toBe(404);
    expect(e.toBody()).toEqual({ errors: { body: ['article not found'] } });
  });

  it('ConflictError → 422 (409 아님) + field별 body', () => {
    const e = new ConflictError('username', 'has already been taken');
    expect(e.statusCode).toBe(422);
    expect(e.toBody()).toEqual({ errors: { username: ['has already been taken'] } });
  });

  it('InternalError → 500 + 메시지 마스킹', () => {
    const e = new InternalError('DB connection refused');
    expect(e.statusCode).toBe(500);
    expect(e.toBody()).toEqual({ errors: { body: ['internal server error'] } });
    expect(e.message).toBe('DB connection refused');
  });

  it('모든 도메인 에러는 AppError instanceof', () => {
    expect(new ValidationError('a', 'b')).toBeInstanceOf(AppError);
    expect(new UnauthorizedError()).toBeInstanceOf(AppError);
    expect(new ForbiddenError()).toBeInstanceOf(AppError);
    expect(new NotFoundError('x')).toBeInstanceOf(AppError);
    expect(new ConflictError('a', 'b')).toBeInstanceOf(AppError);
    expect(new InternalError('x')).toBeInstanceOf(AppError);
  });
});
