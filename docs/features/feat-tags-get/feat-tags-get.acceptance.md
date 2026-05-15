---
doc_type: feature-acceptance
version: v0.1
status: Draft
author: yongtae.cho@bespinglobal.com
date: 2026-05-15
gate: feature
related:
  R-ID: [R-F-16]
  F-ID: [F-10]
  supersedes: null
---

# feat-tags-get — Acceptance Criteria

## 변경 이력

| Version | Date | Author | Change |
|---|---|---|---|
| v0.1 | 2026-05-15 | yongtae.cho@bespinglobal.com | 초안 |

## 1. 인수 기준 (Given/When/Then)

### AC-01: 빈 → 200 + tags:[]

- Given DB 태그 0건
- When GET
- Then 200 + `{tags:[]}`
- 측정: 자동
- R-ID: R-F-16

### AC-02: N건 alphabetical

- Given seed 5 tags
- When GET
- Then 200 + tags 정렬 (express, prisma, react, realworld, typescript)
- 측정: 자동
- R-ID: R-F-16

## 2. Definition of Done (D-06)

- [ ] 통합 2건
- [ ] AI 정적
- [ ] Test Plan 4블록
- [ ] tested 라벨 P14
- [ ] Approve 1
- [ ] CI green N/A

## 3. 비기능 인수

- 응답 ≤50ms.

## 4. 회귀 인수

- 기존 회귀.
