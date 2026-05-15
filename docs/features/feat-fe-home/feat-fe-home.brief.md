---
doc_type: feature-brief
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

# feat-fe-home — Feature Brief

## 변경 이력

| Version | Date | Author | Change |
|---|---|---|---|
| v0.1 | 2026-05-15 | yongtae.cho@bespinglobal.com | 초안 |

## 1. 한 줄 의도

HomePage — Global/Your Feed 탭 + ArticleCard 목록 + Pagination + TagList.

## 2. 사용자 가치

홈 진입 후 글 탐색.

## 3. 현재 상태 → 변경 후 상태

| 측면 | 현재 | 변경 후 |
|---|---|---|
| HomePage | placeholder | 실 피드 |
| ArticleCard | 없음 | 카드 컴포넌트 |
| FeedTabs | 없음 | Your/Global/Tag 탭 |
| Pagination | 없음 | 페이지 numbered |
| TagList sidebar | 없음 | tags 클릭 → 필터 |

## 4. 모드 자동 감지 결과

- mode: add
- 근거: ADR-0032 규칙 4 (type:feature)

## 5. 영향 범위

신규: HomePage, components/ArticleCard·FeedTabs·Pagination·TagList, api/endpoints/articles·tags.

## 6. 비목표

- ArticlePage → #21.

## 7. Open Questions

(없음)
