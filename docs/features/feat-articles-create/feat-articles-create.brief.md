---
doc_type: feature-brief
version: v0.1
status: Draft
author: yongtae.cho@bespinglobal.com
date: 2026-05-15
gate: feature
related:
  R-ID: [R-F-09]
  F-ID: [F-05]
  supersedes: null
---

# feat-articles-create — Feature Brief

## 변경 이력

| Version | Date | Author | Change |
|---|---|---|---|
| v0.1 | 2026-05-15 | yongtae.cho@bespinglobal.com | 초안 |

## 1. 한 줄 의도

POST /api/articles — 글 작성 + slug 자동 생성 + tagList upsert.

## 2. 사용자 가치

작성자가 새 글 게시.

## 3. 현재 상태 → 변경 후 상태

| 측면 | 현재 | 변경 후 |
|---|---|---|
| POST /api/articles | 없음 | requireAuth + slug 생성 + Tag M:N |
| util/slug.ts | 없음 | slugify + 충돌 시 hash suffix |

## 4. 모드 자동 감지 결과

- mode: add
- 근거: ADR-0032 규칙 4 (type:feature)

## 5. 영향 범위

신규: util/slug.ts, articleRepo.create, articleService.create, POST 라우트, 단위·통합.

## 6. 비목표

- PUT/DELETE → #12.
- Your Feed → #13.

## 7. Open Questions

(없음)
