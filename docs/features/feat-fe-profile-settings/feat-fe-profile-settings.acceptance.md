---
doc_type: feature-acceptance
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

# feat-fe-profile-settings — Acceptance Criteria

## 변경 이력

| Version | Date | Author | Change |
|---|---|---|---|
| v0.1 | 2026-05-15 | yongtae.cho@bespinglobal.com | 초안 |

## 1. 인수 기준 (Given/When/Then)

### AC-01: ProfilePage 정상

- Given /profile/:username
- When 진입
- Then profile + 작성 글 탭 + favorited 탭
- 측정: 자동
- R-ID: R-F-04

### AC-02: FollowButton 토글

- Given 인증 + 타인 프로필
- When 클릭
- Then following 상태 토글
- 측정: 자동
- R-ID: R-F-05

### AC-03: 본인 프로필 → follow 버튼 disabled/숨김

- Given viewer === 프로필
- When 페이지
- Then 버튼 비활성
- 측정: 자동
- R-ID: R-F-05

### AC-04: SettingsPage 갱신

- Given 인증
- When PUT
- Then setAuthUser + navigate /
- 측정: 자동
- R-ID: R-F-03

### AC-05: SettingsPage logout

- Given 로그아웃 클릭
- When
- Then clearAuthUser + navigate /
- 측정: 자동
- R-ID: R-F-03

## 2. Definition of Done (D-06)

- [ ] 단위 3건
- [ ] AI 정적
- [ ] Test Plan 4블록
- [ ] tested 라벨 P14
- [ ] Approve 1
- [ ] CI green N/A

## 3. 비기능 인수

- 응답 ≤200ms.

## 4. 회귀 인수

- HomePage·LoginPage 회귀.
