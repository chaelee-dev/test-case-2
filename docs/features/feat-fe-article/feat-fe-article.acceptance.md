---
doc_type: feature-acceptance
version: v0.1
status: Draft
author: yongtae.cho@bespinglobal.com
date: 2026-05-15
gate: feature
related:
  R-ID: [R-F-08]
  F-ID: [F-06]
  supersedes: null
---

# feat-fe-article — Acceptance Criteria

## 변경 이력

| Version | Date | Author | Change |
|---|---|---|---|
| v0.1 | 2026-05-15 | yongtae.cho@bespinglobal.com | 초안 |

## 1. 인수 기준 (Given/When/Then)

### AC-01: 정상 article 렌더

- Given slug
- When /article/:slug
- Then title + body 마크다운 렌더
- 측정: 자동
- R-ID: R-F-08

### AC-02: XSS <script> 제거

- Given body = `<script>alert(1)</script>`
- When render
- Then DOM에 <script> 없음
- 측정: 자동
- R-ID: R-F-08

### AC-03: XSS onerror= 제거

- Given body = `<img src=x onerror="alert(1)">`
- When render
- Then onerror 속성 제거
- 측정: 자동
- R-ID: R-F-08

### AC-04: javascript: href 제거

- Given body = `[click](javascript:alert(1))`
- When render
- Then href javascript: 제거
- 측정: 자동
- R-ID: R-F-08

### AC-05: 안전 HTML 유지

- Given body = `<p><strong>hi</strong></p>`
- When render
- Then <strong>hi</strong> 유지
- 측정: 자동
- R-ID: R-F-08

## 2. Definition of Done (D-06)

- [ ] 단위 8건
- [ ] AI 정적
- [ ] Test Plan 4블록
- [ ] tested 라벨 P14
- [ ] Approve 1
- [ ] CI green N/A

## 3. 비기능 인수

- 렌더 ≤200ms.

## 4. 회귀 인수

- HomePage 회귀.
