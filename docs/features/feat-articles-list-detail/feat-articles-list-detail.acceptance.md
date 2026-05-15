---
doc_type: feature-acceptance
version: v0.1
status: Draft
author: yongtae.cho@bespinglobal.com
date: 2026-05-15
gate: feature
related:
  R-ID: [R-F-06, R-F-08]
  F-ID: [F-03, F-06]
  supersedes: null
---

# feat-articles-list-detail — Acceptance Criteria

## 변경 이력

| Version | Date | Author | Change |
|---|---|---|---|
| v0.1 | 2026-05-15 | yongtae.cho@bespinglobal.com | 초안 |

## 1. 인수 기준 (Given/When/Then)

### AC-01: GET /api/articles 정상

- Given seed 3 articles
- When GET /api/articles
- Then 200 + articles[3], articlesCount=3, createdAt DESC, body 미포함
- 측정: 자동
- R-ID: R-F-06

### AC-02: tag 필터

- Given tag=typescript
- When GET ?tag=typescript
- Then 해당 태그 article만 반환
- 측정: 자동
- R-ID: R-F-06

### AC-03: limit>100 → 422

- Given limit=999
- When GET
- Then 422 must be <=100
- 측정: 자동
- R-ID: R-F-06

### AC-04: GET /:slug 정상

- Given 존재 slug
- When GET
- Then 200 + article (body 포함)
- 측정: 자동
- R-ID: R-F-08

### AC-05: GET /:slug 404

- Given 미존재 slug
- When GET
- Then 404 article not found
- 측정: 자동
- R-ID: R-F-08

### AC-06: optionalAuth favorited 계산

- Given 인증 viewer + 즐겨찾기 1건
- When GET /api/articles
- Then 해당 article의 favorited=true
- 측정: 자동
- R-ID: R-F-06

## 2. Definition of Done (D-06)

- [ ] 단위/통합: integration 8건
- [ ] AI 게이트 정적
- [ ] Test Plan 4블록 PR
- [ ] tested 라벨 P14
- [ ] Approve 1
- [ ] CI green N/A

## 3. 비기능 인수

- 응답 ≤200ms (목록 20 articles).

## 4. 회귀 인수

- 기존 /api/user·/api/profiles 회귀.
