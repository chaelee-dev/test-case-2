---
doc_type: feature-acceptance
version: v0.1
status: Draft
author: yongtae.cho@bespinglobal.com
date: 2026-05-15
gate: feature
related:
  R-ID: [R-F-04, R-F-05]
  F-ID: [F-02, F-08]
  supersedes: null
---

# feat-profile-follow — Acceptance Criteria

## 변경 이력

| Version | Date | Author | Change |
|---|---|---|---|
| v0.1 | 2026-05-15 | yongtae.cho@bespinglobal.com | 초안 |

## 1. 인수 기준 (Given/When/Then)

### AC-01: GET /api/profiles/:username 정상

- Given 가입자 + 익명 viewer
- When GET
- Then 200 + `{profile:{username,bio,image,following:false}}`
- 측정: 자동
- R-ID: R-F-04

### AC-02: GET 미존재 → 404

- Given 미존재 username
- When GET
- Then 404 + `{"errors":{"body":["profile not found"]}}`
- 측정: 자동
- R-ID: R-F-04

### AC-03: POST follow → 200 following=true

- Given 인증 viewer + target user
- When POST
- Then 200 + following=true
- 측정: 자동
- R-ID: R-F-05

### AC-04: DELETE follow → following=false

- Given 인증 viewer 팔로우 중
- When DELETE
- Then 200 + following=false
- 측정: 자동
- R-ID: R-F-05

### AC-05: self-follow 422

- Given 본인 자신
- When POST
- Then 422 + cannot follow yourself
- 측정: 자동
- R-ID: R-F-05

### AC-06: 401 (POST/DELETE 인증 누락)

- Given 토큰 없음
- When POST/DELETE
- Then 401
- 측정: 자동
- R-ID: R-F-05

### AC-07: idempotent POST

- Given 이미 팔로우 중
- When POST 재호출
- Then 200 + following=true (중복 row 없음)
- 측정: 자동
- R-ID: R-F-05

## 2. Definition of Done (D-06)

- [ ] 단위 테스트 5건
- [ ] 통합 테스트 7건
- [ ] AI 게이트 정적
- [ ] Test Plan 4블록 PR
- [ ] tested 라벨 P14
- [ ] Approve 1
- [ ] CI green N/A

## 3. 비기능 인수

- 응답 ≤100ms.

## 4. 회귀 인수

- GET/PUT /api/user, /api/users 회귀.
