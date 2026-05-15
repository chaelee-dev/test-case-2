---
doc_type: feature-plan
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

# feat-articles-feed — Implementation Plan

## 변경 이력

| Version | Date | Author | Change |
|---|---|---|---|
| v0.1 | 2026-05-15 | yongtae.cho@bespinglobal.com | 초안 |

## 1. 커밋 시퀀스 (DAG)

| # | 커밋 | 영향 파일 | 테스트 추가 | 회귀 위험 |
|---|---|---|---|---|
| 1 | `feat(backend): articleService.feed + GET /api/articles/feed (#13)` | followRepo.findFollowedIds, articleRepo.listByFollowedAuthors, articleService.feed, routes | integration 4 | 중간 |

## 2. 의존성 그래프

```
#1 단일 커밋
```

Blocked-by: 없음.

## 3. 테스트 매핑

| 커밋 | 테스트 추가 위치 | 시나리오 |
|---|---|---|
| #1 | articles.feed.integration.test.ts | feed 정상 / 팔로우 0건 빈 / 401 / limit |

## 4. 빌드·실행 검증 단계

```bash
./devkit test backend
curl -H "Authorization: Token <jwt>" localhost:3000/api/articles/feed?limit=20
```

## 5. 점진 합의 / 결정 발생 항목

- ADR: no.
- 라우터 순서 — /feed가 /:slug 앞에 마운트 (slug 매칭 회피).
