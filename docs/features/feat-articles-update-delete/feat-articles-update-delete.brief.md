---
doc_type: feature-brief
version: v0.1
status: Draft
author: yongtae.cho@bespinglobal.com
date: 2026-05-15
gate: feature
related:
  R-ID: [R-F-10, R-F-11]
  F-ID: [F-05]
  supersedes: null
---

# feat-articles-update-delete — Feature Brief

## 변경 이력

| Version | Date | Author | Change |
|---|---|---|---|
| v0.1 | 2026-05-15 | yongtae.cho@bespinglobal.com | 초안 |

## 1. 한 줄 의도

PUT /api/articles/:slug + DELETE. title 변경 시 slug 재생성. 작성자 본인만 수정/삭제.

## 2. 사용자 가치

본인 글 수정·삭제.

## 3. 현재 상태 → 변경 후 상태

| 측면 | 현재 | 변경 후 |
|---|---|---|
| PUT /:slug | 없음 | 부분 갱신 + slug 재생성 |
| DELETE /:slug | 없음 | cascade (Comment·Favorite·ArticleTag) |

## 4. 모드 자동 감지 결과

- mode: add
- 근거: ADR-0032 규칙 4 (type:feature)

## 5. 영향 범위

신규: articleRepo.update/delete, articleService.update/remove, PUT·DELETE 라우트, 통합.

## 6. 비목표

- Favorite → #14.

## 7. Open Questions

- OQ-01 (slug 정책): title 변경 시 새 slug 발급, 이전 slug 무효 (brief O-01).
