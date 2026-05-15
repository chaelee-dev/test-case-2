---
doc_type: feature-plan
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

# feat-profile-follow — Implementation Plan

## 변경 이력

| Version | Date | Author | Change |
|---|---|---|---|
| v0.1 | 2026-05-15 | yongtae.cho@bespinglobal.com | 초안 |

## 1. 커밋 시퀀스 (DAG)

| # | 커밋 | 영향 파일 | 테스트 추가 | 회귀 위험 |
|---|---|---|---|---|
| 1 | `feat(backend): followRepo + userService.profile/follow/unfollow (#9)` | `repos/followRepo.ts`, `services/userService.ts`, unit | unit 5 | 중간 |
| 2 | `feat(backend): /api/profiles 라우트 (#9)` | `routes/profiles.ts`, `app.ts`, integration | integration 7 | 중간 |

## 2. 의존성 그래프

```
#1 → #2
```

Blocked-by: 없음.

## 3. 테스트 매핑

| 커밋 | 테스트 추가 위치 | 시나리오 |
|---|---|---|
| #1 | userService.test.ts | getProfile / follow / unfollow / self-follow 거절 / 미존재 username NotFound |
| #2 | profiles.integration.test.ts | GET 200 / 404 미존재 / POST 200 following=true / DELETE 200 following=false / 401 무인증 / 422 self-follow / GET optionalAuth following 계산 |

## 4. 빌드·실행 검증 단계

```bash
./devkit test backend
curl -H "Authorization: Token <jwt>" localhost:3000/api/profiles/jane_dev
curl -X POST -H "Authorization: Token <jwt>" localhost:3000/api/profiles/jane_dev/follow
```

## 5. 점진 합의 / 결정 발생 항목

- ADR 작성 필요: no.
- 결정: self-follow 422 (OQ-02).
