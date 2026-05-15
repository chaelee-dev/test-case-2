---
doc_type: feature-acceptance
version: v0.1
status: Draft
author: yongtae.cho@bespinglobal.com
date: 2026-05-15
gate: feature
related:
  R-ID: [R-F-07]
  F-ID: [F-04]
  supersedes: null
---

# feat-articles-feed — Acceptance Criteria

## 변경 이력

| Version | Date | Author | Change |
|---|---|---|---|
| v0.1 | 2026-05-15 | yongtae.cho@bespinglobal.com | 초안 |

## 1. 인수 기준 (Given/When/Then)

### AC-01: feed 정상

- Given viewer가 author A를 팔로우 + A가 article 2건 작성
- When GET /api/articles/feed
- Then 200 + articles A의 2건, articlesCount=2
- 측정: 자동
- R-ID: R-F-07

### AC-02: 팔로우 0건 → 빈 배열

- Given viewer가 팔로우 0건
- When GET
- Then 200 + articles=[], articlesCount=0
- 측정: 자동
- R-ID: R-F-07

### AC-03: 401 (인증 없음)

- Given 토큰 없음
- When GET
- Then 401
- 측정: 자동
- R-ID: R-F-07

### AC-04: limit 적용

- Given 팔로우 작가 글 5건 + limit=2
- When GET
- Then articles 2건, articlesCount=5
- 측정: 자동
- R-ID: R-F-07

## 2. Definition of Done (D-06)

- [ ] 통합 4건
- [ ] AI 정적
- [ ] Test Plan 4블록
- [ ] tested 라벨 P14
- [ ] Approve 1
- [ ] CI green N/A

## 3. 비기능 인수

- 응답 ≤200ms.

## 4. 회귀 인수

- GET / GET /:slug 회귀.
