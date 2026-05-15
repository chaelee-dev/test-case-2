---
doc_type: feature-contract
version: v0.1
status: Draft
author: yongtae.cho@bespinglobal.com
date: 2026-05-15
gate: feature
related:
  R-ID: [R-F-03, R-F-04, R-F-05]
  F-ID: [F-02, F-08]
  supersedes: null
---

# feat-fe-profile-settings — Change Contract

## 변경 이력

| Version | Date | Author | Change |
|---|---|---|---|
| v0.1 | 2026-05-15 | yongtae.cho@bespinglobal.com | 초안 |

## 0. 참조 정본 ID (Referenced-IDs)

| 종류 | 정본 위치 | 영향 ID |
|---|---|---|
| R-ID (요구) | `docs/planning/04-srs/04-srs.md` | R-F-03, R-F-04, R-F-05 |
| F-ID (기능) | `docs/planning/05-prd/05-prd.md` | F-02, F-08 |
| 영향 모듈 | `docs/planning/07-hld/07-hld.md` | M-FE-Pages, M-FE-Components |
| 영향 엔드포인트 | `docs/planning/09-lld-api-spec/09-lld-api-spec.md` | GET/PUT /api/user, /api/profiles/* |
| 적용 컨벤션 절 | `docs/planning/11-coding-conventions/11-coding-conventions.md` | §3 |

## 1. 변경 의도

프로필·설정 페이지 완성.

## 2. Before / After

| 항목 | Before | After |
|---|---|---|
| pages/ProfilePage.tsx | placeholder | 본인/타인 분기 + 글 탭 |
| pages/SettingsPage.tsx | placeholder | bio·image·email·username·password 폼 + logout |
| components/FollowButton.tsx | 없음 | 본 버튼 |
| api/endpoints/profiles.ts | 없음 | getProfile·follow·unfollow |

## 3. 호출자·의존자 (Call Sites)

| 위치 | 영향 | 조치 |
|---|---|---|
| Router /profile/:username·/settings | 본 페이지 | 본 PR |

## 4. Backward Compatibility

- Breaking: no.

## 5. Rollback 전략

- revert 가능: yes.

## 6. 비목표

(없음)
