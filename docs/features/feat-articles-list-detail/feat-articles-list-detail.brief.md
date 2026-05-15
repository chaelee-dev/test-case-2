---
doc_type: feature-brief
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

# feat-articles-list-detail — Feature Brief

## 변경 이력

| Version | Date | Author | Change |
|---|---|---|---|
| v0.1 | 2026-05-15 | yongtae.cho@bespinglobal.com | 초안 |

## 1. 한 줄 의도

GET /api/articles (필터 tag/author/favorited + 페이지) + GET /api/articles/:slug. 인증 선택.

## 2. 사용자 가치

홈 피드(Global Feed) 표시. 글 상세 페이지.

## 3. 현재 상태 → 변경 후 상태

| 측면 | 현재 | 변경 후 |
|---|---|---|
| Article CRUD | schema만 | list + get 구현 |
| favoritesCount | 없음 | COUNT(Favorite) |
| following | 없음 | viewer 기반 계산 |

## 4. 모드 자동 감지 결과

- mode: add
- 근거: ADR-0032 규칙 4 (type:feature)

## 5. 영향 범위

신규: articleRepo, favoriteRepo (count), tagRepo (toNames), articleService.list/get, routes/articles.ts, 통합 테스트.

## 6. 비목표

- POST/PUT/DELETE → ISS-BE-ART-02/03
- Your Feed → ART-04
- Favorite POST/DELETE → ISS-BE-FAV-01

## 7. Open Questions

- OQ-03: max limit 100 (사양 default 20만).
