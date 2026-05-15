---
doc_type: feature-contract
version: v0.1
status: Draft
author: yongtae.cho@bespinglobal.com
date: 2026-05-15
gate: feature
related:
  R-ID: [R-F-08]
  F-ID: [F-06]
  supersedes: null
---

# feat-fe-article — Change Contract

## 변경 이력

| Version | Date | Author | Change |
|---|---|---|---|
| v0.1 | 2026-05-15 | yongtae.cho@bespinglobal.com | 초안 |

## 0. 참조 정본 ID (Referenced-IDs)

| 종류 | 정본 위치 | 영향 ID |
|---|---|---|
| R-ID (요구) | `docs/planning/04-srs/04-srs.md` | R-F-08 |
| F-ID (기능) | `docs/planning/05-prd/05-prd.md` | F-06 |
| 영향 모듈 | `docs/planning/07-hld/07-hld.md` | M-FE-Pages, M-FE-Markdown |
| 영향 엔드포인트 | `docs/planning/09-lld-api-spec/09-lld-api-spec.md` | GET /api/articles/:slug |
| 적용 컨벤션 절 | `docs/planning/11-coding-conventions/11-coding-conventions.md` | 보안: DOMPurify 강제 |

## 1. 변경 의도

ArticlePage + 안전 마크다운 렌더. XSS 방어 (RISK-03).

## 2. Before / After

| 항목 | Before | After |
|---|---|---|
| markdown/render.ts | 없음 | marked → DOMPurify → HTML |
| markdown/purifyConfig.ts | 없음 | ALLOWED_TAGS·ALLOWED_ATTR 화이트리스트 |
| pages/ArticlePage.tsx | placeholder | article fetch + render + dangerouslySetInnerHTML (sanitized) |
| deps | 기존 | + marked, dompurify, @types/dompurify |

## 3. 호출자·의존자 (Call Sites)

| 위치 | 영향 | 조치 |
|---|---|---|
| Router /article/:slug | ArticlePage | 본 PR |
| #24 Comments | render() 재사용 | 후속 |

## 4. Backward Compatibility

- Breaking: no.

## 5. Rollback 전략

- revert 가능: yes.

## 6. 비목표

- Comments → #24.
