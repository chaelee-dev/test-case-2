---
doc_type: feature-plan
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

# feat-articles-list-detail — Implementation Plan

## 변경 이력

| Version | Date | Author | Change |
|---|---|---|---|
| v0.1 | 2026-05-15 | yongtae.cho@bespinglobal.com | 초안 |

## 1. 커밋 시퀀스 (DAG)

| # | 커밋 | 영향 파일 | 테스트 추가 | 회귀 위험 |
|---|---|---|---|---|
| 1 | `feat(backend): articleRepo + favoriteRepo + tagRepo (#10)` | repos/*Repo.ts | (#2에서 통합 검증) | 중간 |
| 2 | `feat(backend): articleService.list/get + /api/articles 라우트 (#10)` | services/articleService.ts, routes/articles.ts, app.ts, integration | integration 8 | 중간 |

## 2. 의존성 그래프

```
#1 → #2
```

Blocked-by: 없음.

## 3. 테스트 매핑

| 커밋 | 테스트 추가 위치 | 시나리오 |
|---|---|---|
| #2 | articles.integration.test.ts | GET 200 / tag 필터 / author 필터 / favorited 필터 / limit>100 422 / offset 음수 422 / GET /:slug 200 / GET /:slug 404 |

## 4. 빌드·실행 검증 단계

```bash
./devkit test backend
curl localhost:3000/api/articles?limit=10
curl localhost:3000/api/articles/how-to-conduit
```

## 5. 점진 합의 / 결정 발생 항목

- ADR: no.
- OQ-03 적용 (max limit 100).
