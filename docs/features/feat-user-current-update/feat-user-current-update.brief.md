---
doc_type: feature-brief
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

# feat-user-current-update — Feature Brief

## 변경 이력

| Version | Date | Author | Change |
|---|---|---|---|
| v0.1 | 2026-05-15 | yongtae.cho@bespinglobal.com | 초안 |

## 1. 한 줄 의도

GET /api/user (현재 사용자 조회) + PUT /api/user (부분 갱신, 화이트리스트).

## 2. 사용자 가치

- 가입 직후 user 정보 확인.
- bio·image·email·username·password 부분 갱신.

## 3. 현재 상태 → 변경 후 상태

| 측면 | 현재 | 변경 후 |
|---|---|---|
| GET /api/user | 없음 | requireAuth + userService.getCurrent |
| PUT /api/user | 없음 | requireAuth + userService.update (whitelist) |

## 4. 모드 자동 감지 결과

- mode: add
- 근거: ADR-0032 규칙 4 (type:feature)

## 5. 영향 범위

신규: userService.getCurrent/update, routes/users.ts에 GET·PUT 추가, userRepo.update, 단위·통합 테스트.

## 6. 비목표

- 프로필·팔로우·게시글 → 후속 sprint.

## 7. Open Questions

- OQ-D3: password 비움 시 미변경 — 본 PR에서 적용 (값이 truthy일 때만 hash·set).
