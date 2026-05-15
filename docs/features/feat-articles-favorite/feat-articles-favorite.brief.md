---
doc_type: feature-brief
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

# feat-articles-favorite — Feature Brief

## 변경 이력

| Version | Date | Author | Change |
|---|---|---|---|
| v0.1 | 2026-05-15 | yongtae.cho@bespinglobal.com | 초안 |

## 1. 한 줄 의도

POST/DELETE /api/articles/:slug/favorite 즐겨찾기 토글.

## 2. 사용자 가치

작가에게 좋아요. 사용자 favorited 목록.

## 3. 현재 상태 → 변경 후 상태

| 측면 | 현재 | 변경 후 |
|---|---|---|
| favorite POST/DELETE | 없음 | requireAuth + idempotent |

## 4. 모드 자동 감지 결과

- mode: add
- 근거: ADR-0032 규칙 4 (type:feature)

## 5. 영향 범위

신규: articleService.favoriteToggle, POST/DELETE 라우트.

## 6. 비목표

- 댓글 → #15.

## 7. Open Questions

(없음)
