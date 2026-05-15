---
doc_type: feature-brief
version: v0.1
status: Draft
author: yongtae.cho@bespinglobal.com
date: 2026-05-15
gate: feature
related:
  R-ID: [R-N-03]
  F-ID: []
  supersedes: null
---

# feat-express-error-mapper — Feature Brief

## 변경 이력

| Version | Date | Author | Change |
|---|---|---|---|
| v0.1 | 2026-05-15 | yongtae.cho@bespinglobal.com | 초안 |

## 1. 한 줄 의도

Express app factory + 도메인 에러 클래스 5종 + ErrorHandler 미들웨어 + CORS allow-list + traceId 로깅 도입.

## 2. 사용자 가치

- 후속 BE 서비스(UserService·ArticleService 등)가 일관된 에러 throw 패턴 사용.
- RealWorld 사양의 `{"errors":{"field":["msg"]}}` 응답 형식을 단일 미들웨어에서 강제.
- traceId로 요청 트레이싱 가능.

## 3. 현재 상태 → 변경 후 상태

| 측면 | 현재 | 변경 후 |
|---|---|---|
| Express app | server.ts에 인라인 createApp() — health 라우트만 | `app.ts` factory + 미들웨어 체인 |
| 도메인 에러 | 없음 | 5 클래스 (ValidationError 422, UnauthorizedError 401, ForbiddenError 403, NotFoundError 404, ConflictError 422, InternalError 5xx) |
| ErrorHandler | 없음 | `middleware/errorHandler.ts` — 에러 클래스별 상태코드·body 매핑 |
| CORS | 없음 | `middleware/cors.ts` — `CORS_ALLOW_ORIGINS` env 화이트리스트 |
| traceId | 없음 | `middleware/requestLogger.ts` — UUID 부여 + 로그 |

## 4. 모드 자동 감지 결과

- mode: add
- 근거: ADR-0032 규칙 4 (부정 시그널 0건, type:feature 라벨)

## 5. 영향 범위

신규: `backend/src/app.ts`, `backend/src/middleware/{errorHandler,cors,requestLogger}.ts`, `backend/src/errors/{types,index}.ts`, `backend/src/config/env.ts`. 단위·통합 테스트.
수정: `backend/src/server.ts` — createApp을 app.ts로 이동.

## 6. 비목표

- JWT는 ISS-BE-AUTH-01.
- Prisma는 ISS-BE-INIT-02.

## 7. Open Questions

(없음)
