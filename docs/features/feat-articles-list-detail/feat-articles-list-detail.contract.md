---
doc_type: feature-contract
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

# feat-articles-list-detail — Change Contract

## 변경 이력

| Version | Date | Author | Change |
|---|---|---|---|
| v0.1 | 2026-05-15 | yongtae.cho@bespinglobal.com | 초안 |

## 0. 참조 정본 ID (Referenced-IDs)

| 종류 | 정본 위치 | 영향 ID |
|---|---|---|
| R-ID (요구) | `docs/planning/04-srs/04-srs.md` | R-F-06 (목록·필터·페이지), R-F-08 (상세) |
| F-ID (기능) | `docs/planning/05-prd/05-prd.md` | F-03 (홈피드), F-06 (글 상세) |
| 영향 모듈 | `docs/planning/07-hld/07-hld.md` | M-BE-ArticleService, M-BE-Repos, M-BE-Routers |
| 영향 엔드포인트 | `docs/planning/09-lld-api-spec/09-lld-api-spec.md` | GET /api/articles, GET /api/articles/:slug |
| 적용 컨벤션 절 | `docs/planning/11-coding-conventions/11-coding-conventions.md` | §2 ValidationError·NotFoundError |

## 1. 변경 의도

페이지 + 필터로 목록 조회. 상세 조회. favoritesCount·following 계산 포함.

## 2. Before / After

| 항목 | Before | After |
|---|---|---|
| `repos/articleRepo.ts` | 없음 | findMany(filters) + findBySlug + count |
| `repos/favoriteRepo.ts` | 없음 | exists / countByArticle |
| `repos/tagRepo.ts` | 없음 | toNames(articleIds) helper |
| `services/articleService.ts` | 없음 | list/get + 응답 직렬화 (author following + favorited + favoritesCount) |
| `routes/articles.ts` | 없음 | GET / + GET /:slug (optionalAuth) |
| `app.ts` | (변경) | mount /api/articles |
| 통합 테스트 | 없음 | articles.integration.test.ts 케이스 |

## 3. 호출자·의존자 (Call Sites)

| 위치 | 영향 | 조치 |
|---|---|---|
| FE HomePage | GET /api/articles | Sprint 3 |
| FE ArticlePage | GET /api/articles/:slug | Sprint 3 |

## 4. Backward Compatibility

- Breaking: no.
- 마이그레이션: no.

## 5. Rollback 전략

- revert 가능: yes — 단순 revert.
- 데이터 손상 위험: 없음 (조회만).

## 6. 비목표

- POST/PUT/DELETE → 후속 이슈.
