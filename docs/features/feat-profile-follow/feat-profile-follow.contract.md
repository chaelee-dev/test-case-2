---
doc_type: feature-contract
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

# feat-profile-follow — Change Contract

## 변경 이력

| Version | Date | Author | Change |
|---|---|---|---|
| v0.1 | 2026-05-15 | yongtae.cho@bespinglobal.com | 초안 |

## 0. 참조 정본 ID (Referenced-IDs)

| 종류 | 정본 위치 | 영향 ID |
|---|---|---|
| R-ID (요구) | `docs/planning/04-srs/04-srs.md` | R-F-04 (프로필 조회), R-F-05 (팔로우/언팔로우) |
| F-ID (기능) | `docs/planning/05-prd/05-prd.md` | F-02, F-08 |
| 영향 모듈 | `docs/planning/07-hld/07-hld.md` | M-BE-UserService, M-BE-Repos, M-BE-Routers |
| 영향 엔드포인트 | `docs/planning/09-lld-api-spec/09-lld-api-spec.md` | GET /api/profiles/:username, POST/DELETE /api/profiles/:username/follow |
| 적용 컨벤션 절 | `docs/planning/11-coding-conventions/11-coding-conventions.md` | §2 NotFoundError·ValidationError |

## 1. 변경 의도

프로필 조회 + 팔로우 토글. self-follow 422 (RISK-02).

## 2. Before / After

| 항목 | Before | After |
|---|---|---|
| `repos/followRepo.ts` | 없음 | create/delete/exists |
| `services/userService.ts` getProfile/follow/unfollow | 없음 | 추가 |
| `routes/profiles.ts` | 없음 | GET·POST·DELETE 3 라우트 |
| `app.ts` mount | (없음) | `/api/profiles` |
| 통합 테스트 `profiles.integration.test.ts` | 없음 | GET/POST/DELETE 케이스 |

## 3. 호출자·의존자 (Call Sites)

| 위치 | 영향 | 조치 |
|---|---|---|
| FE Profile page | 본 엔드포인트 | Sprint 3 |
| FE Follow button | POST/DELETE | Sprint 3 |

## 4. Backward Compatibility

- Breaking: no.
- 마이그레이션: no.

## 5. Rollback 전략

- revert 가능: yes.
- 데이터 손상: follow row 손실 가능 (sprint 2 초기, 낮음).

## 6. 비목표

- Profile 내 Articles 목록 → R-F-06 (별도 이슈)
