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

# feat-comments-crud — Feature Brief

## 변경 이력

| Version | Date | Author | Change |
|---|---|---|---|
| v0.1 | 2026-05-15 | yongtae.cho@bespinglobal.com | 초안 |

## 1. 한 줄 의도

GET/POST /api/articles/:slug/comments + DELETE /comments/:id.

## 2. 사용자 가치

글에 댓글 + 작성·삭제.

## 3. 현재 상태 → 변경 후 상태

| 측면 | 현재 | 변경 후 |
|---|---|---|
| Comment 모듈 | 없음 | repo·service·route + 통합 |

## 4. 모드 자동 감지 결과

- mode: add
- 근거: ADR-0032 규칙 4 (type:feature)

## 5. 영향 범위

신규: commentRepo, commentService, routes/comments (또는 articles 라우터 추가), 통합.

## 6. 비목표

- Tags GET → #16.

## 7. Open Questions

(없음)
