---
doc_type: feature-plan
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

# feat-express-error-mapper — Implementation Plan

## 변경 이력

| Version | Date | Author | Change |
|---|---|---|---|
| v0.1 | 2026-05-15 | yongtae.cho@bespinglobal.com | 초안 |

## 1. 커밋 시퀀스 (DAG)

| # | 커밋 | 영향 파일 | 테스트 추가 | 회귀 위험 |
|---|---|---|---|---|
| 1 | `feat(backend): 도메인 에러 클래스 5종 + barrel (#4)` | `backend/src/errors/{types,index}.ts` | `__tests__/errors.test.ts` (5 클래스 statusCode·body 검증) | 낮음 |
| 2 | `feat(backend): config/env.ts zod 검증 (#4)` | `backend/src/config/env.ts`, package.json zod dep | `__tests__/env.test.ts` (필수 변수 누락 시 fail-fast) | 낮음 |
| 3 | `feat(backend): errorHandler + cors + requestLogger 미들웨어 (#4)` | `backend/src/middleware/{errorHandler,cors,requestLogger}.ts`, deps(cors/uuid/pino) | `__tests__/errorHandler.test.ts` | 중간 — 5 에러 매핑 |
| 4 | `feat(backend): app.ts factory + server.ts 분리 + 통합 테스트 (#4)` | `backend/src/app.ts`, `server.ts` 수정 | `__tests__/app.integration.test.ts` (5 에러 throw) | 중간 |

## 2. 의존성 그래프

```
#1 (errors) ──▶ #3 (errorHandler가 errors import)
#2 (env)    ──▶ #3 (cors가 env.CORS_ALLOW_ORIGINS 사용) + #4 (app.ts가 env import)
#3 ──▶ #4 (app.ts가 middleware 3종 use)
```

Blocked-by: 없음. ISS-INFRA-01(server.ts 존재) 완료됨.

## 3. 테스트 매핑

| 커밋 | 테스트 추가 위치 | 시나리오 |
|---|---|---|
| #1 | `backend/src/__tests__/errors.test.ts` | 5 클래스 각각 statusCode·name·toBody 검증 (단위) |
| #2 | `backend/src/__tests__/env.test.ts` | 정상 + JWT_SECRET 누락 시 throw (단위) |
| #3 | `backend/src/__tests__/errorHandler.test.ts` | mock req/res + 6 에러 throw → status·body (단위) |
| #4 | `backend/src/__tests__/app.integration.test.ts` | 임시 라우트 5개에서 각각 throw → supertest 응답 검증 (통합) |

커버리지 목표: BE services 90% (13-test-design §1) — 본 모듈은 핵심이므로 정확히 90% 이상.

## 4. 빌드·실행 검증 단계

```bash
# 동적 (P14 휴먼 게이트)
pnpm install
./devkit test backend            # vitest run, 4 신규 테스트 파일 모두 PASS
./devkit dev backend &
curl -i http://localhost:3000/health           # 200
curl -i http://localhost:3000/api/__error/validation  # 422 + {errors:{...}}
kill %1
```

## 5. 점진 합의 / 결정 발생 항목

- ADR 작성 필요: no — 11 §2 결정 적용.
- 결정 변경 잠재 항목: ConflictError를 422 → 409로 변경 시 ADR (RealWorld 사양 충실 우선이라 현재 422 유지).
