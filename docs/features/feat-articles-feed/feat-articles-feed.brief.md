---
doc_type: feature-brief
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

# feat-articles-feed — Feature Brief

## 변경 이력

| Version | Date | Author | Change |
|---|---|---|---|
| v0.1 | 2026-05-15 | yongtae.cho@bespinglobal.com | 초안 |

## 1. 한 줄 의도

GET /api/articles/feed — 인증 사용자가 팔로우한 작가들의 글만 (requireAuth + 페이지).

## 2. 사용자 가치

Your Feed.

## 3. 현재 상태 → 변경 후 상태

| 측면 | 현재 | 변경 후 |
|---|---|---|
| Feed | 없음 | feed(viewerId, limit, offset) |

## 4. 모드 자동 감지 결과

- mode: add
- 근거: ADR-0032 규칙 4 (type:feature)

## 5. 영향 범위

신규: articleService.feed, GET /api/articles/feed (라우터 순서 중요 — /:slug 보다 앞).

## 6. 비목표

- 알림·실시간 → 사양 외.

## 7. Open Questions

(없음)
