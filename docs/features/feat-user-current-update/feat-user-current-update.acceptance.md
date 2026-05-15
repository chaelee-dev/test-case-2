---
doc_type: feature-acceptance
version: v0.1
status: Draft
author: yongtae.cho@bespinglobal.com
date: 2026-05-15
gate: feature
related:
  R-ID: [R-F-03]
  F-ID: [F-01, F-02]
  supersedes: null
---

# feat-user-current-update — Acceptance Criteria

## 변경 이력

| Version | Date | Author | Change |
|---|---|---|---|
| v0.1 | 2026-05-15 | yongtae.cho@bespinglobal.com | 초안 |

## 1. 인수 기준 (Given/When/Then)

### AC-01: GET /api/user 정상

- Given 유효 JWT
- When `GET /api/user` 호출
- Then 200 + `{user:{email,token,username,bio,image}}`
- 측정: 자동 (supertest)
- R-ID: R-F-03

### AC-02: GET /api/user 401

- Given 만료/누락/Bearer JWT
- When 호출
- Then 401 + unauthorized body
- 측정: 자동
- R-ID: R-F-03

### AC-03: PUT 부분 갱신

- Given 유효 JWT + body `{user:{bio:"new"}}`
- When PUT
- Then 200 + 갱신된 bio
- 측정: 자동
- R-ID: R-F-03

### AC-04: PUT 화이트리스트만 적용

- Given body `{user:{bio:"new", id:999, isAdmin:true}}`
- When PUT
- Then id·isAdmin 등 무시, bio만 갱신
- 측정: 자동
- R-ID: R-F-03

### AC-05: PUT 중복 email → 422

- Given 두 사용자 + B의 email로 A가 PUT
- When PUT
- Then 422 has already been taken
- 측정: 자동
- R-ID: R-F-03

### AC-06: PUT password 비움 → 미변경

- Given body `{user:{password:""}}`
- When PUT
- Then 200 + passwordHash unchanged
- 측정: 자동
- R-ID: R-F-03 (OQ-D3)

## 2. Definition of Done (D-06)

- [ ] 단위 테스트: userService.test.ts +5건
- [ ] 통합 테스트: users.integration.test.ts +6건
- [ ] AI 게이트: 정적
- [ ] Test Plan 4블록: PR
- [ ] tested 라벨: P14
- [ ] Approve: 1
- [ ] CI green: N/A

## 3. 비기능 인수

- GET 응답 ≤50ms.

## 4. 회귀 인수

- POST /api/users·login 기존 8 케이스 회귀.
