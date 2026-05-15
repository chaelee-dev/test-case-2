---
doc_type: feature-contract
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

# feat-fe-home — Change Contract

## 변경 이력

| Version | Date | Author | Change |
|---|---|---|---|
| v0.1 | 2026-05-15 | yongtae.cho@bespinglobal.com | 초안 |

## 0. 참조 정본 ID (Referenced-IDs)

| 종류 | 정본 위치 | 영향 ID |
|---|---|---|
| R-ID (요구) | `docs/planning/04-srs/04-srs.md` | R-F-06, R-F-07, R-F-16 |
| F-ID (기능) | `docs/planning/05-prd/05-prd.md` | F-03, F-04, F-10 |
| 영향 모듈 | `docs/planning/07-hld/07-hld.md` | M-FE-Pages, M-FE-Components, M-FE-ApiClient |
| 영향 엔드포인트 | `docs/planning/09-lld-api-spec/09-lld-api-spec.md` | GET /api/articles, /feed, /tags |
| 적용 컨벤션 절 | `docs/planning/11-coding-conventions/11-coding-conventions.md` | §3 컴포넌트 명명 |

## 1. 변경 의도

HomePage 실 피드 구현.

## 2. Before / After

| 항목 | Before | After |
|---|---|---|
| pages/HomePage.tsx | placeholder | banner + tabs + articles + sidebar tags + pagination |
| components/ArticleCard.tsx | 없음 | 단일 카드 |
| components/FeedTabs.tsx | 없음 | Your/Global/Tag 탭 |
| components/Pagination.tsx | 없음 | 페이지 numbered |
| components/TagList.tsx | 없음 | tags 클릭 |
| api/endpoints/articles.ts | 없음 | list/feed/getBySlug 추가 |
| api/endpoints/tags.ts | 없음 | listAll |

## 3. 호출자·의존자 (Call Sites)

| 위치 | 영향 | 조치 |
|---|---|---|
| Router / | HomePage | 본 PR |

## 4. Backward Compatibility

- Breaking: no.

## 5. Rollback 전략

- revert 가능: yes.

## 6. 비목표

(없음)
