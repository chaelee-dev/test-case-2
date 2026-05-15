---
doc_type: feature-contract
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

# feat-fe-comments — Change Contract

## 변경 이력

| Version | Date | Author | Change |
|---|---|---|---|
| v0.1 | 2026-05-15 | yongtae.cho@bespinglobal.com | 초안 |

## 0. 참조 정본 ID (Referenced-IDs)

| 종류 | 정본 위치 | 영향 ID |
|---|---|---|
| R-ID (요구) | `docs/planning/04-srs/04-srs.md` | R-F-13, R-F-14, R-F-15 |
| F-ID (기능) | `docs/planning/05-prd/05-prd.md` | F-09 |
| 영향 모듈 | `docs/planning/07-hld/07-hld.md` | M-FE-Components |
| 영향 엔드포인트 | `docs/planning/09-lld-api-spec/09-lld-api-spec.md` | GET/POST/DELETE /comments |
| 적용 컨벤션 절 | `docs/planning/11-coding-conventions/11-coding-conventions.md` | §3 |

## 1. 변경 의도

ArticlePage 하단 댓글.

## 2. Before / After

| 항목 | Before | After |
|---|---|---|
| api/endpoints/comments.ts | 없음 | list/create/delete |
| components/CommentForm.tsx | 없음 | body textarea + submit |
| components/CommentItem.tsx | 없음 | body + author + delete (본인 OR 글 작성자) |
| pages/ArticlePage.tsx | (기존) | 댓글 섹션 추가 |

## 3. 호출자·의존자 (Call Sites)

| 위치 | 영향 | 조치 |
|---|---|---|
| ArticlePage | 본 컴포넌트 | 본 PR |

## 4. Backward Compatibility

- Breaking: no.

## 5. Rollback 전략

- revert 가능: yes.

## 6. 비목표

(없음)
