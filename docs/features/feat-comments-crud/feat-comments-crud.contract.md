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

# feat-comments-crud — Change Contract

## 변경 이력

| Version | Date | Author | Change |
|---|---|---|---|
| v0.1 | 2026-05-15 | yongtae.cho@bespinglobal.com | 초안 |

## 0. 참조 정본 ID (Referenced-IDs)

| 종류 | 정본 위치 | 영향 ID |
|---|---|---|
| R-ID (요구) | `docs/planning/04-srs/04-srs.md` | R-F-13 (목록), R-F-14 (작성), R-F-15 (삭제) |
| F-ID (기능) | `docs/planning/05-prd/05-prd.md` | F-09 |
| 영향 모듈 | `docs/planning/07-hld/07-hld.md` | M-BE-CommentService, M-BE-Repos, M-BE-Routers |
| 영향 엔드포인트 | `docs/planning/09-lld-api-spec/09-lld-api-spec.md` | GET/POST /:slug/comments, DELETE /:slug/comments/:id |
| 적용 컨벤션 절 | `docs/planning/11-coding-conventions/11-coding-conventions.md` | §2 NotFound/Forbidden/Validation |

## 1. 변경 의도

댓글 CRUD. 작성자 또는 글 작성자가 삭제 가능.

## 2. Before / After

| 항목 | Before | After |
|---|---|---|
| repos/commentRepo.ts | 없음 | list/create/findById/delete |
| services/commentService.ts | 없음 | list/create/remove + 작성자 검증 |
| routes/comments.ts | 없음 | 3 라우트, /api/articles/:slug 하위 |
| app.ts | (변경) | mount /api/articles/:slug/comments |
| 통합 테스트 | 없음 | comments.integration |

## 3. 호출자·의존자 (Call Sites)

| 위치 | 영향 | 조치 |
|---|---|---|
| FE ArticlePage Comments | GET/POST/DELETE | Sprint 3 |

## 4. Backward Compatibility

- Breaking: no.

## 5. Rollback 전략

- revert 가능: yes.
- 데이터 손상 위험: Comment row 손실 (sprint 2 초기, 낮음).

## 6. 비목표

(없음)
