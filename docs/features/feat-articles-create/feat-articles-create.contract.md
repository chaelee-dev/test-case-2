---
doc_type: feature-contract
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

# feat-articles-create — Change Contract

## 변경 이력

| Version | Date | Author | Change |
|---|---|---|---|
| v0.1 | 2026-05-15 | yongtae.cho@bespinglobal.com | 초안 |

## 0. 참조 정본 ID (Referenced-IDs)

| 종류 | 정본 위치 | 영향 ID |
|---|---|---|
| R-ID (요구) | `docs/planning/04-srs/04-srs.md` | R-F-09 (글 작성) |
| F-ID (기능) | `docs/planning/05-prd/05-prd.md` | F-05 (작성/수정/삭제) |
| 영향 모듈 | `docs/planning/07-hld/07-hld.md` | M-BE-ArticleService, M-BE-Repos |
| 영향 엔드포인트 | `docs/planning/09-lld-api-spec/09-lld-api-spec.md` | POST /api/articles |
| 적용 컨벤션 절 | `docs/planning/11-coding-conventions/11-coding-conventions.md` | §2 ValidationError 422 |

## 1. 변경 의도

POST 글 + slug 자동 생성 (충돌 시 hash suffix) + tagList upsert (M:N).

## 2. Before / After

| 항목 | Before | After |
|---|---|---|
| `util/slug.ts` | 없음 | slugify(title) + suffix(seed) |
| `articleRepo.create` | 없음 | 트랜잭션 — article insert + ArticleTag insert |
| `articleService.create` | 없음 | title/description/body 검증 + tagList ensureTags + slug 충돌 재시도 |
| routes/articles.ts | GET 2 | + POST / (requireAuth) |
| 단위 테스트 slug.test.ts | 없음 | slugify·suffix 케이스 |
| 통합 테스트 articles.integration | (기존 추가) | POST 정상·빈 title 422·tagList 처리·인증 401 |

## 3. 호출자·의존자 (Call Sites)

| 위치 | 영향 | 조치 |
|---|---|---|
| FE EditorPage Create | POST | Sprint 3 |
| ART-03 PUT title 변경 시 slug 재생성 | util/slug 의존 | 후속 |

## 4. Backward Compatibility

- Breaking: no.
- 마이그레이션: no.

## 5. Rollback 전략

- revert 가능: yes.
- 데이터 손상 위험: 작성된 article·tag row 손실 (sprint 2, 위험 낮음).

## 6. 비목표

- PUT/DELETE → #12.
