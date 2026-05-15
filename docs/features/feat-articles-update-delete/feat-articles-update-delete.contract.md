---
doc_type: feature-contract
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

# feat-articles-update-delete — Change Contract

## 변경 이력

| Version | Date | Author | Change |
|---|---|---|---|
| v0.1 | 2026-05-15 | yongtae.cho@bespinglobal.com | 초안 |

## 0. 참조 정본 ID (Referenced-IDs)

| 종류 | 정본 위치 | 영향 ID |
|---|---|---|
| R-ID (요구) | `docs/planning/04-srs/04-srs.md` | R-F-10 (수정), R-F-11 (삭제) |
| F-ID (기능) | `docs/planning/05-prd/05-prd.md` | F-05 |
| 영향 모듈 | `docs/planning/07-hld/07-hld.md` | M-BE-ArticleService, M-BE-Repos |
| 영향 엔드포인트 | `docs/planning/09-lld-api-spec/09-lld-api-spec.md` | PUT /api/articles/:slug, DELETE |
| 적용 컨벤션 절 | `docs/planning/11-coding-conventions/11-coding-conventions.md` | §2 Forbidden 403 + NotFound 404 |

## 1. 변경 의도

본인 글만 수정·삭제. title 변경 시 slug 재생성. cascade로 Comment·Favorite·ArticleTag 동시 삭제 (schema).

## 2. Before / After

| 항목 | Before | After |
|---|---|---|
| articleRepo.update | 없음 | partial update + tag 재구성 (옵션) |
| articleRepo.delete | 없음 | Prisma delete (cascade) |
| articleService.update | 없음 | 작성자 검증 + slug 재생성 + 부분 갱신 |
| articleService.remove | 없음 | 작성자 검증 + delete |
| routes/articles.ts | GET/POST | + PUT·DELETE |
| 통합 테스트 | 기존 | articles.update-delete.integration |

## 3. 호출자·의존자 (Call Sites)

| 위치 | 영향 | 조치 |
|---|---|---|
| FE EditorPage Edit | PUT | Sprint 3 |
| FE Delete button | DELETE | Sprint 3 |

## 4. Backward Compatibility

- Breaking: no (이전 slug 무효는 brief 명시 — 첫 도입이라 영향 없음).

## 5. Rollback 전략

- revert 가능: yes.
- 데이터 손상 위험: DELETE 된 article·Comment·Favorite·ArticleTag 손실. revert로 DB 복구 불가. 신중 권고.

## 6. 비목표

- Favorite POST/DELETE → #14.
