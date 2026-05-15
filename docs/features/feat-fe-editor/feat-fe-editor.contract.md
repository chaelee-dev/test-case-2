---
doc_type: feature-contract
version: v0.1
status: Draft
author: yongtae.cho@bespinglobal.com
date: 2026-05-15
gate: feature
related:
  R-ID: [R-F-09, R-F-10, R-F-11]
  F-ID: [F-05]
  supersedes: null
---

# feat-fe-editor — Change Contract

## 변경 이력

| Version | Date | Author | Change |
|---|---|---|---|
| v0.1 | 2026-05-15 | yongtae.cho@bespinglobal.com | 초안 |

## 0. 참조 정본 ID (Referenced-IDs)

| 종류 | 정본 위치 | 영향 ID |
|---|---|---|
| R-ID (요구) | `docs/planning/04-srs/04-srs.md` | R-F-09, R-F-10, R-F-11 |
| F-ID (기능) | `docs/planning/05-prd/05-prd.md` | F-05 |
| 영향 모듈 | `docs/planning/07-hld/07-hld.md` | M-FE-Pages |
| 영향 엔드포인트 | `docs/planning/09-lld-api-spec/09-lld-api-spec.md` | POST·PUT·DELETE /api/articles |
| 적용 컨벤션 절 | `docs/planning/11-coding-conventions/11-coding-conventions.md` | §3 |

## 1. 변경 의도

EditorPage 실 구현 + ArticlePage 작성자 delete 버튼.

## 2. Before / After

| 항목 | Before | After |
|---|---|---|
| pages/EditorPage.tsx | placeholder | 실 폼 + 분기 (new/edit) |
| pages/ArticlePage.tsx | (기존) | 작성자만 Edit + Delete 버튼 |

## 3. 호출자·의존자 (Call Sites)

| 위치 | 영향 | 조치 |
|---|---|---|
| Router /editor·/editor/:slug | EditorPage | 본 PR |

## 4. Backward Compatibility

- Breaking: no.

## 5. Rollback 전략

- revert 가능: yes.

## 6. 비목표

(없음)
