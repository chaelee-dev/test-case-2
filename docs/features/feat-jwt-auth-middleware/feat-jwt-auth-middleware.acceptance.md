---
doc_type: feature-acceptance
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

# feat-jwt-auth-middleware — Acceptance Criteria

## 변경 이력

| Version | Date | Author | Change |
|---|---|---|---|
| v0.1 | 2026-05-15 | yongtae.cho@bespinglobal.com | 초안 |

## 1. 인수 기준 (Given/When/Then)

### AC-01: JWT sign + verify roundtrip

- Given `JWT_SECRET` 32바이트
- When `sign(123)` → `verify(token)`
- Then `{ userId: 123 }` 반환
- 측정 방법: 자동 테스트
- R-ID: R-N-02

### AC-02: Authorization: Token <jwt> 통과

- Given 유효 JWT
- When `Authorization: Token <jwt>` 헤더로 보호 라우트 호출
- Then `req.user.id` 부착 + 200 응답
- 측정 방법: 자동 테스트
- R-ID: R-N-02

### AC-03: Bearer prefix 거부

- Given 유효 JWT
- When `Authorization: Bearer <jwt>` 헤더
- Then 401 + `{"errors":{"body":["unauthorized"]}}`
- 측정 방법: 자동 테스트
- R-ID: R-N-02

### AC-04: 만료 토큰 → 401

- Given `JWT_EXP_SECONDS=1` 설정 + sign 후 2초 대기
- When verify
- Then UnauthorizedError throw + 401 응답
- 측정 방법: 자동 테스트
- R-ID: R-N-02

### AC-05: optionalAuth 헤더 누락 시 통과

- Given 헤더 없음
- When optionalAuth 미들웨어 통과
- Then req.user 없음 + 라우트로 진행
- 측정 방법: 자동 테스트
- R-ID: R-N-02

## 2. Definition of Done (D-06)

- [ ] 단위 테스트: jwtService.test.ts, auth.middleware.test.ts PASS
- [ ] AI 게이트: 정적
- [ ] Test Plan 4블록: PR 본문
- [ ] tested 라벨: 휴먼 게이트
- [ ] Approve: 1명
- [ ] CI green: N/A (ISS-CI-01 BLOCKED)

## 3. 비기능 인수

- verify 응답 시간 ≤5ms (HMAC 검증).

## 4. 회귀 인수

- 후속 보호 라우트가 requireAuth import 가능.
