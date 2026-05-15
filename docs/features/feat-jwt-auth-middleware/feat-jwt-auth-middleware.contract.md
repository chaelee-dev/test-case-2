---
doc_type: feature-contract
version: v0.1
status: Draft
author: yongtae.cho@bespinglobal.com
date: 2026-05-15
gate: feature
related:
  R-ID: [R-N-02]
  F-ID: []
  supersedes: null
---

# feat-jwt-auth-middleware — Change Contract

## 변경 이력

| Version | Date | Author | Change |
|---|---|---|---|
| v0.1 | 2026-05-15 | yongtae.cho@bespinglobal.com | 초안 |

## 0. 참조 정본 ID (Referenced-IDs)

| 종류 | 정본 위치 | 영향 ID |
|---|---|---|
| R-ID (요구) | `docs/planning/04-srs/04-srs.md` | R-N-02 (보안: JWT exp 24h, bcrypt cost 12) |
| F-ID (기능) | `docs/planning/05-prd/05-prd.md` | (none) — 인프라 |
| 영향 모듈 | `docs/planning/07-hld/07-hld.md` | M-BE-JwtService, M-BE-AuthMiddleware |
| 영향 엔드포인트 | `docs/planning/09-lld-api-spec/09-lld-api-spec.md` | (모든 보호 라우트) |
| 적용 컨벤션 절 | `docs/planning/11-coding-conventions/11-coding-conventions.md` | §2 UnauthorizedError 401 |

## 1. 변경 의도

JWT sign(`exp=JWT_EXP_SECONDS`) + verify. AuthMiddleware는 `Authorization: Token <jwt>` 강제 (Bearer 거부 = RISK-02 완화).

## 2. Before / After

| 항목 | Before | After |
|---|---|---|
| `backend/src/services/jwtService.ts` | 없음 | sign(userId): string / verify(token): { userId } / throw UnauthorizedError |
| `backend/src/middleware/auth.ts` | 없음 | requireAuth (401 throw) / optionalAuth (no-op if header missing) |
| Request 타입 | `traceId` only | `user?: { id: number }` 추가 |
| `backend/src/__tests__/jwtService.test.ts` | 없음 | sign/verify, 만료, 위변조, Bearer 거부 |
| `backend/src/__tests__/auth.middleware.test.ts` | 없음 | requireAuth/optionalAuth 통합 |
| `backend/package.json` deps | 기존 | + jsonwebtoken |

## 3. 호출자·의존자 (Call Sites)

| 위치 | 영향 | 조치 |
|---|---|---|
| 후속 ISS-BE-USR-01 (로그인) | jwtService.sign | 후속 이슈 책임 |
| 후속 보호 라우트 (PUT /api/user 등) | requireAuth middleware | mountExtraRoutes에서 router.use(requireAuth) |
| `backend/src/middleware/requestLogger.ts` | Request 확장 위치 | declare module 추가만 (충돌 없음) |

## 4. Backward Compatibility

- Breaking: no.
- 마이그레이션 필요: no.

## 5. Rollback 전략

- revert 가능: yes — 단순 revert.
- 데이터 손상 위험: 없음.

## 6. 비목표

- /api/users·/api/users/login 라우트 → ISS-BE-USR-01.
- 사용자 모델 import → 후속 이슈.
