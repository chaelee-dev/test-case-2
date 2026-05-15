---
doc_type: feature-brief
version: v0.1
status: Draft
author: yongtae.cho@bespinglobal.com
date: 2026-05-15
gate: feature
related:
  R-ID: [R-F-13, R-F-14, R-F-15]
  F-ID: [F-09]
  supersedes: null
---

# feat-fe-comments — Feature Brief

## 변경 이력

| Version | Date | Author | Change |
|---|---|---|---|
| v0.1 | 2026-05-15 | yongtae.cho@bespinglobal.com | 초안 |

## 1. 한 줄 의도

ArticlePage 하단 댓글 — CommentForm + CommentItem 목록 + 작성자만 삭제.

## 2. 사용자 가치

글에 의견.

## 3. 현재 상태 → 변경 후 상태

| 측면 | 현재 | 변경 후 |
|---|---|---|
| Comments UI | 없음 | ArticlePage에 통합 |

## 4. 모드 자동 감지 결과

- mode: add
- 근거: ADR-0032 규칙 4 (type:feature)

## 5. 영향 범위

신규: components/CommentForm·CommentItem, ArticlePage 댓글 섹션, api/endpoints/comments.

## 6. 비목표

(없음)

## 7. Open Questions

(없음)
