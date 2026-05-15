---
doc_type: feature-brief
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

# feat-jwt-auth-middleware — Feature Brief

## 변경 이력

| Version | Date | Author | Change |
|---|---|---|---|
| v0.1 | 2026-05-15 | yongtae.cho@bespinglobal.com | 초안 |

## 1. 한 줄 의도

JwtService(sign/verify) + AuthMiddleware(requireAuth·optionalAuth) 도입. `Authorization: Token <jwt>` 형식 강제 (Bearer 거부).

## 2. 사용자 가치

- 후속 UserService·ArticleService가 인증 미들웨어 import해서 보호 라우트 강제.
- RealWorld 사양의 `Token` prefix 정합 — 다른 Bearer 토큰과 혼동 방지.

## 3. 현재 상태 → 변경 후 상태

| 측면 | 현재 | 변경 후 |
|---|---|---|
| JwtService | 없음 | `services/jwtService.ts` — sign(userId)·verify(token) |
| AuthMiddleware | 없음 | `middleware/auth.ts` — requireAuth(401 throw)·optionalAuth(continue if missing) |
| req.user | 없음 | Express Request에 user 필드 부착 |

## 4. 모드 자동 감지 결과

- mode: add
- 근거: ADR-0032 규칙 4 (type:feature)

## 5. 영향 범위

신규: `backend/src/services/jwtService.ts`, `backend/src/middleware/auth.ts`, 단위 테스트 2.

## 6. 비목표

- 사용자 등록·로그인 → ISS-BE-USR-01.
- 리프레시 토큰 → brief OQ-04 (운영 단계 결정).

## 7. Open Questions

- OQ-04 (R-N-02 JWT 갱신): refresh token 없음 — 현재 만료 시 재로그인.
