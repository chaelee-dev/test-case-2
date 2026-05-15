---
doc_type: feature-plan
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

# feat-user-current-update — Implementation Plan

## 변경 이력

| Version | Date | Author | Change |
|---|---|---|---|
| v0.1 | 2026-05-15 | yongtae.cho@bespinglobal.com | 초안 |

## 1. 커밋 시퀀스 (DAG)

| # | 커밋 | 영향 파일 | 테스트 추가 | 회귀 위험 |
|---|---|---|---|---|
| 1 | `feat(backend): userRepo.update + userService.getCurrent/update (#8)` | `backend/src/repos/userRepo.ts`, `backend/src/services/userService.ts`, `__tests__/userService.test.ts` | unit 5 | 중간 |
| 2 | `feat(backend): GET/PUT /api/user 라우트 (#8)` | `backend/src/routes/users.ts`, `__tests__/users.integration.test.ts` | integration 6 | 중간 |

## 2. 의존성 그래프

```
#1 (repo·service) ──▶ #2 (router)
```

Blocked-by: 없음 (USR-01 머지됨).

## 3. 테스트 매핑

| 커밋 | 테스트 추가 위치 | 시나리오 |
|---|---|---|
| #1 | userService.test.ts | getCurrent / update 정상 / 화이트리스트 (other fields 무시) / 중복 username·email / password 비움 시 미변경 |
| #2 | users.integration.test.ts | GET 200 (Token) / GET 401 (만료/누락) / PUT 200 부분 갱신 / PUT 422 중복 / PUT 401 / PUT password 비움 |

## 4. 빌드·실행 검증 단계

```bash
# 동적 P14
./devkit test backend
./devkit dev backend &
TOKEN=$(curl -s -X POST localhost:3000/api/users/login -H "Content-Type: application/json" -d '{"user":{"email":"admin@conduit.example","password":"password"}}' | jq -r .user.token)
curl -H "Authorization: Token $TOKEN" localhost:3000/api/user      # 200
curl -X PUT -H "Authorization: Token $TOKEN" -H "Content-Type: application/json" -d '{"user":{"bio":"updated"}}' localhost:3000/api/user
```

## 5. 점진 합의 / 결정 발생 항목

- ADR: no.
- OQ-D3 결정: password 비움 = 미변경 (본 PR 적용).
