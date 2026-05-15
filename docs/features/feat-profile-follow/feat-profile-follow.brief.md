---
doc_type: feature-brief
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

# feat-profile-follow — Feature Brief

## 변경 이력

| Version | Date | Author | Change |
|---|---|---|---|
| v0.1 | 2026-05-15 | yongtae.cho@bespinglobal.com | 초안 |

## 1. 한 줄 의도

GET /api/profiles/:username + POST/DELETE follow. 본인 자신 팔로우 422.

## 2. 사용자 가치

프로필 조회 + 팔로우 토글. Sprint 3 FE Profile/Follow 버튼의 BE.

## 3. 현재 상태 → 변경 후 상태

| 측면 | 현재 | 변경 후 |
|---|---|---|
| Profile | 없음 | GET /api/profiles/:username + optionalAuth |
| Follow | 없음 | POST/DELETE .../follow + requireAuth |

## 4. 모드 자동 감지 결과

- mode: add
- 근거: ADR-0032 규칙 4 (type:feature)

## 5. 영향 범위

신규: followRepo, userService.getProfile/follow/unfollow, routes/profiles.ts, 통합 테스트.

## 6. 비목표

- Articles, Comments, Tags → 후속 이슈.

## 7. Open Questions

- OQ-02 (R-F-05): self-follow 422 (사양 모호 → 본 결정).
