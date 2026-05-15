---
doc_type: feature-plan
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

# feat-user-register-login — Implementation Plan

## 변경 이력

| Version | Date | Author | Change |
|---|---|---|---|
| v0.1 | 2026-05-15 | yongtae.cho@bespinglobal.com | 초안 |

## 1. 커밋 시퀀스 (DAG)

| # | 커밋 | 영향 파일 | 테스트 추가 | 회귀 위험 |
|---|---|---|---|---|
| 1 | `feat(backend): userRepo (#7)` | `backend/src/repos/userRepo.ts`, deps(bcrypt) | (#2 통합으로 검증) | 낮음 |
| 2 | `feat(backend): userService register + login + bcrypt cost=12 (#7)` | `backend/src/services/userService.ts`, `__tests__/userService.test.ts` | unit 6 | 중간 |
| 3 | `feat(backend): /api/users + /api/users/login 라우트 마운트 (#7)` | `backend/src/routes/users.ts`, `backend/src/app.ts`, `__tests__/users.integration.test.ts` | integration 8 | 중간 |
| 4 | `feat(backend): seed.ts 실 bcrypt cost=12로 교체 (#7)` | `backend/prisma/seed.ts` | (휴먼 게이트 — 재실행 가능) | 낮음 |

## 2. 의존성 그래프

```
#1 (userRepo) ──▶ #2 (service)
                    │
                    ▼
                  #3 (router) ──▶ #4 (seed bcrypt)
```

Blocked-by: 없음 (USR-AUTH-01·BE-INIT-02 완료됨).

## 3. 테스트 매핑

| 커밋 | 테스트 추가 위치 | 시나리오 |
|---|---|---|
| #2 | `userService.test.ts` | register/login 정상 / 중복 username·email / bcrypt 미스매치 / 사양 메시지 형식 |
| #3 | `users.integration.test.ts` | POST 정상 / 422 중복 / 422 형식 위반 / 로그인 정상 / 로그인 실패 / Content-Type / token 반환 |

커버리지: BE services 90% (13-test-design §1).

## 4. 빌드·실행 검증 단계

```bash
# 동적 (P14)
./devkit test backend   # vitest run 모두 PASS
./devkit dev backend &
curl -X POST http://localhost:3000/api/users -H "Content-Type: application/json" -d '{"user":{"username":"u1","email":"u1@e.com","password":"pw12345678"}}'
# 200 + user.token

curl -X POST http://localhost:3000/api/users/login -H "Content-Type: application/json" -d '{"user":{"email":"u1@e.com","password":"pw12345678"}}'
# 200 + user.token
```

## 5. 점진 합의 / 결정 발생 항목

- ADR: no.
- 잠재: password 정책(길이 8 vs 12) → ADR 신설 검토. 현재 무제약.
