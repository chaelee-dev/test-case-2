/**
 * RealWorld 사양 — 에러 응답 body는 `{"errors":{"<field>":["<msg>"]}}` 형식.
 * 11-conventions §2 에러 클래스 prefix 표 정합.
 */

export type ErrorBody = { errors: Record<string, string[]> };

export abstract class AppError extends Error {
  abstract readonly statusCode: number;
  readonly field: string;

  constructor(field: string, message: string) {
    super(message);
    this.field = field;
    this.name = this.constructor.name;
  }

  toBody(): ErrorBody {
    return { errors: { [this.field]: [this.message] } };
  }
}

/** HTTP 422 — 검증 실패 / 중복(사양상 422) */
export class ValidationError extends AppError {
  readonly statusCode = 422;
}

/** HTTP 401 — 인증 실패. field는 항상 "body" */
export class UnauthorizedError extends AppError {
  readonly statusCode = 401;
  constructor(message = 'unauthorized') {
    super('body', message);
  }
}

/** HTTP 403 — 권한 부족. field는 항상 "body" */
export class ForbiddenError extends AppError {
  readonly statusCode = 403;
  constructor(message = 'forbidden') {
    super('body', message);
  }
}

/** HTTP 404 — 미존재. field는 "body" */
export class NotFoundError extends AppError {
  readonly statusCode = 404;
  constructor(message: string) {
    super('body', message);
  }
}

/** HTTP 422 — 중복 (RealWorld 사양: 422, 409 사용 금지) */
export class ConflictError extends AppError {
  readonly statusCode = 422;
}

/** HTTP 500 — 미예상. body는 항상 "internal server error" 고정 (메시지 마스킹) */
export class InternalError extends AppError {
  readonly statusCode = 500;
  constructor(message: string) {
    super('body', message);
  }
  toBody(): ErrorBody {
    return { errors: { body: ['internal server error'] } };
  }
}
