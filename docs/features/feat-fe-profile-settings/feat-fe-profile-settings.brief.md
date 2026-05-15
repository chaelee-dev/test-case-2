---
doc_type: feature-brief
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

# feat-fe-profile-settings — Feature Brief

## 변경 이력

| Version | Date | Author | Change |
|---|---|---|---|
| v0.1 | 2026-05-15 | yongtae.cho@bespinglobal.com | 초안 |

## 1. 한 줄 의도

ProfilePage (작가 정보 + 작성 글) + SettingsPage (본인 정보 갱신) + Follow 버튼.

## 2. 사용자 가치

프로필·설정 페이지 완성.

## 3. 현재 상태 → 변경 후 상태

| 측면 | 현재 | 변경 후 |
|---|---|---|
| ProfilePage | placeholder | 실 프로필 + 본인 글·즐겨찾기 탭 |
| SettingsPage | placeholder | 폼 + PUT /api/user |
| FollowButton | 없음 | profile-follow API |

## 4. 모드 자동 감지 결과

- mode: add
- 근거: ADR-0032 규칙 4 (type:feature)

## 5. 영향 범위

신규: ProfilePage·SettingsPage 실 구현, FollowButton 컴포넌트, profiles endpoint.

## 6. 비목표

- Comments → #24.

## 7. Open Questions

(없음)
