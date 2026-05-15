---
doc_type: feature-acceptance
version: v0.1
status: Draft
author: yongtae.cho@bespinglobal.com
date: 2026-05-15
gate: feature
related:
  R-ID: [R-F-01, R-F-02]
  F-ID: [F-01]
  supersedes: null
---

# feat-user-register-login — Acceptance Criteria

## 변경 이력

| Version | Date | Author | Change |
|---|---|---|---|
| v0.1 | 2026-05-15 | yongtae.cho@bespinglobal.com | 초안 |

## 1. 인수 기준 (Given/When/Then)

### AC-01: 정상 가입 → 200 + user 반환

- Given 미가입 사용자
- When `POST /api/users {user:{username,email,password}}`
- Then 200 + `{user:{email,token,username,bio:'',image:null}}`
- 측정: 자동 테스트 (supertest)
- R-ID: R-F-01

### AC-02: 중복 username → 422 ConflictError

- Given 이미 사용된 username
- When POST /api/users
- Then 422 + `{errors:{username:["has already been taken"]}}`
- 측정: 자동
- R-ID: R-F-01

### AC-03: 중복 email → 422

- Given 이미 사용된 email
- When POST /api/users
- Then 422 + `{errors:{email:["has already been taken"]}}`
- 측정: 자동
- R-ID: R-F-01

### AC-04: 잘못된 email 형식 → 422

- Given email = "not-an-email"
- When POST
- Then 422 + `{errors:{email:["is invalid"]}}`
- 측정: 자동
- R-ID: R-F-01

### AC-05: 로그인 정상 → 200 + token

- Given AC-01 완료 (가입)
- When POST /api/users/login 정확 자격증명
- Then 200 + user.token
- 측정: 자동
- R-ID: R-F-02

### AC-06: 잘못된 password → 422 동일 메시지

- Given 가입자 + 잘못된 password
- When POST /api/users/login
- Then 422 + `{errors:{"email or password":["is invalid"]}}`
- 측정: 자동
- R-ID: R-F-02

### AC-07: 미가입 email → 동일한 422 메시지 (timing oracle 회피)

- Given 미가입 email
- When POST /api/users/login
- Then 422 + 동일한 `{errors:{"email or password":["is invalid"]}}`
- 측정: 자동
- R-ID: R-F-02

### AC-08: bcrypt cost = 12

- Given 가입 직후
- When user.passwordHash 검사
- Then `$2b$12$...` (cost 12) 형식
- 측정: 자동
- R-ID: R-N-02 (인접)

## 2. Definition of Done (D-06)

- [ ] 단위 테스트: userService.test.ts 6+ PASS
- [ ] 통합 테스트: users.integration.test.ts 8+ PASS
- [ ] AI 게이트: 정적
- [ ] Test Plan 4블록: PR
- [ ] tested 라벨: P14
- [ ] Approve: 1명
- [ ] CI green: N/A (#3 BLOCKED)

## 3. 비기능 인수

- 가입 응답 시간 ≤200ms (bcrypt cost=12 ~80ms + DB insert).
- 로그인 ≤150ms.

## 4. 회귀 인수

- 기존 /health 200 유지.
- seed 재실행 가능 (멱등).
