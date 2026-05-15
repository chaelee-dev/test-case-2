---
doc_type: feature-acceptance
version: v0.1
status: Draft
author: yongtae.cho@bespinglobal.com
date: 2026-05-15
gate: feature
related:
  R-ID: [R-N-04]
  F-ID: [F-11]
  supersedes: null
---

# feat-fe-navbar-route — Acceptance Criteria

## 변경 이력

| Version | Date | Author | Change |
|---|---|---|---|
| v0.1 | 2026-05-15 | yongtae.cho@bespinglobal.com | 초안 |

## 1. 인수 기준 (Given/When/Then)

### AC-01: 익명 NavBar — Sign in/Sign up 표시

- Given 익명
- When /
- Then Home / Sign in / Sign up 링크
- 측정: 자동
- R-ID: R-N-04

### AC-02: 인증 NavBar — New Article / Settings / Profile

- Given user
- When /
- Then Home / New Article / Settings / username 링크
- 측정: 자동
- R-ID: R-N-04

### AC-03: 404 페이지

- Given /nonexistent
- When
- Then NotFoundPage 표시
- 측정: 자동
- R-ID: R-N-04

## 2. Definition of Done (D-06)

- [ ] 단위 2건
- [ ] AI 정적
- [ ] Test Plan 4블록
- [ ] tested 라벨 P14
- [ ] Approve 1
- [ ] CI green N/A

## 3. 비기능 인수

- 렌더 ≤100ms.

## 4. 회귀 인수

- ProtectedRoute redirect 회귀.
