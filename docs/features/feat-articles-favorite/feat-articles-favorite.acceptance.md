---
doc_type: feature-acceptance
version: v0.1
status: Draft
author: yongtae.cho@bespinglobal.com
date: 2026-05-15
gate: feature
related:
  R-ID: [R-F-12]
  F-ID: [F-07]
  supersedes: null
---

# feat-articles-favorite — Acceptance Criteria

## 변경 이력

| Version | Date | Author | Change |
|---|---|---|---|
| v0.1 | 2026-05-15 | yongtae.cho@bespinglobal.com | 초안 |

## 1. 인수 기준 (Given/When/Then)

### AC-01: POST favorite 정상

- Given 인증 + article 존재
- When POST /:slug/favorite
- Then 200 + article (favorited=true, favoritesCount+1)
- 측정: 자동
- R-ID: R-F-12

### AC-02: DELETE 정상

- Given 인증 + favorited
- When DELETE
- Then 200 + favorited=false
- 측정: 자동
- R-ID: R-F-12

### AC-03: 미존재 slug → 404

- Given 미존재 slug
- When POST/DELETE
- Then 404
- 측정: 자동
- R-ID: R-F-12

### AC-04: 401

- Given 토큰 없음
- When POST/DELETE
- Then 401
- 측정: 자동
- R-ID: R-F-12

### AC-05: idempotent

- Given 이미 favorited
- When POST 재호출
- Then 200 + favorited=true (중복 row 없음)
- 측정: 자동
- R-ID: R-F-12

## 2. Definition of Done (D-06)

- [ ] 통합 5건
- [ ] AI 정적
- [ ] Test Plan 4블록
- [ ] tested 라벨 P14
- [ ] Approve 1
- [ ] CI green N/A

## 3. 비기능 인수

- 응답 ≤100ms.

## 4. 회귀 인수

- GET /api/articles 회귀.
