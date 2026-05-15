---
doc_type: feature-acceptance
version: v0.1
status: Draft
author: yongtae.cho@bespinglobal.com
date: 2026-05-15
gate: feature
related:
  R-ID: [R-F-06, R-F-07, R-F-16]
  F-ID: [F-03, F-04, F-10]
  supersedes: null
---

# feat-fe-home — Acceptance Criteria

## 변경 이력

| Version | Date | Author | Change |
|---|---|---|---|
| v0.1 | 2026-05-15 | yongtae.cho@bespinglobal.com | 초안 |

## 1. 인수 기준 (Given/When/Then)

### AC-01: HomePage 익명 → Global tab

- Given 익명
- When /
- Then banner + Global tab + 글 N건
- 측정: 자동
- R-ID: R-F-06

### AC-02: 인증 → Your Feed tab

- Given user
- When /
- Then Your Feed tab 표시
- 측정: 자동
- R-ID: R-F-07

### AC-03: tag 클릭 → 필터

- Given sidebar tags
- When tag 클릭
- Then ?tag=X 적용된 목록
- 측정: 자동
- R-ID: R-F-06

### AC-04: pagination

- Given articlesCount=50, limit=20
- When page 2 클릭
- Then offset=20
- 측정: 자동
- R-ID: R-F-06

## 2. Definition of Done (D-06)

- [ ] 단위 6건
- [ ] AI 정적
- [ ] Test Plan 4블록
- [ ] tested 라벨 P14
- [ ] Approve 1
- [ ] CI green N/A

## 3. 비기능 인수

- TTI ≤2s.

## 4. 회귀 인수

- LoginPage·RegisterPage 회귀.
