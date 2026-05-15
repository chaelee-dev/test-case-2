---
doc_type: feature-contract
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

# feat-express-error-mapper — Change Contract

## 변경 이력

| Version | Date | Author | Change |
|---|---|---|---|
| v0.1 | 2026-05-15 | yongtae.cho@bespinglobal.com | 초안 |

## 0. 참조 정본 ID (Referenced-IDs)

| 종류 | 정본 위치 | 영향 ID |
|---|---|---|
| R-ID (요구) | `docs/planning/04-srs/04-srs.md` | R-N-03 (관측·traceId·로그 레벨) |
| F-ID (기능) | `docs/planning/05-prd/05-prd.md` | (none) — 인프라 미들웨어 |
| 영향 모듈 | `docs/planning/07-hld/07-hld.md` | M-BE-HttpServer, M-BE-ErrorMapper |
| 영향 엔드포인트 | `docs/planning/09-lld-api-spec/09-lld-api-spec.md` | 모든 (에러 응답 형식 영향) |
| 적용 컨벤션 절 | `docs/planning/11-coding-conventions/11-coding-conventions.md` | §2 에러 클래스 prefix 표 |

## 1. 변경 의도

Express 미들웨어 체인 + 도메인 에러 클래스 + 에러→HTTP 매핑을 단일 책임 모듈로 구축. 후속 서비스 이슈(USR·ART·CMT)는 본 모듈을 import해서 사용만.

## 2. Before / After

| 항목 | Before | After |
|---|---|---|
| `backend/src/server.ts` | createApp 인라인 + listen | listen만. createApp은 app.ts로 이동 |
| `backend/src/app.ts` | 없음 | createApp factory — express.json + cors + requestLogger + (라우트 placeholder) + errorHandler |
| `backend/src/errors/types.ts` | 없음 | 추상 클래스 `AppError` + 5 도메인 에러 클래스 |
| `backend/src/errors/index.ts` | 없음 | barrel re-export |
| `backend/src/middleware/errorHandler.ts` | 없음 | AppError → HTTP body 매핑. 비-AppError → 500 |
| `backend/src/middleware/cors.ts` | 없음 | env `CORS_ALLOW_ORIGINS` 화이트리스트 |
| `backend/src/middleware/requestLogger.ts` | 없음 | UUID traceId + req 로그 |
| `backend/src/config/env.ts` | 없음 | zod 스키마로 env validation (PORT·DATABASE_URL·JWT_SECRET 등) |
| `backend/src/__tests__/errorHandler.test.ts` | 없음 | 단위 — 5 에러 클래스 → 응답 body 매핑 |
| `backend/src/__tests__/app.integration.test.ts` | 없음 | 통합 — supertest로 5 에러 throw 케이스 |
| `backend/package.json` deps | express, supertest, vitest | + cors, uuid, zod, pino, pino-http |

## 3. 호출자·의존자 (Call Sites)

| 위치 | 영향 | 조치 |
|---|---|---|
| `backend/src/server.ts` | createApp 호출 위치 변경 | import 1줄 변경 |
| `backend/src/__tests__/health.test.ts` | createApp import 경로 동일 (re-export) | 변경 없음 |
| 후속 ISS-BE-USR-01 (UserService) | `errors/index.ts` import | 후속 이슈 책임 |
| ISS-BE-AUTH-01 | `errors/UnauthorizedError` 활용 | 후속 이슈 책임 |

## 4. Backward Compatibility

- Breaking: no — 기존 /health 응답 형식 동일 유지.
- 마이그레이션 필요: no — 외부 클라이언트 없음 (sprint 1).

## 5. Rollback 전략

- revert 가능: yes — `git revert -m 1 <merge>` 1회.
- rollback 절차: 단순 revert.
- 데이터 손상 위험: 없음 (DB 미연결).

## 6. 비목표

- JWT verify·signing → ISS-BE-AUTH-01.
- Prisma client·models → ISS-BE-INIT-02.
- domain 라우트 (`/api/users`·`/api/articles` 등) → 후속 서비스 이슈.
