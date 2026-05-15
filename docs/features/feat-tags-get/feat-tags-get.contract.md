---
doc_type: feature-contract
version: v0.1
status: Draft
author: yongtae.cho@bespinglobal.com
date: 2026-05-15
gate: feature
related:
  R-ID: [R-F-16]
  F-ID: [F-10]
  supersedes: null
---

# feat-tags-get — Change Contract

## 변경 이력

| Version | Date | Author | Change |
|---|---|---|---|
| v0.1 | 2026-05-15 | yongtae.cho@bespinglobal.com | 초안 |

## 0. 참조 정본 ID (Referenced-IDs)

| 종류 | 정본 위치 | 영향 ID |
|---|---|---|
| R-ID (요구) | `docs/planning/04-srs/04-srs.md` | R-F-16 |
| F-ID (기능) | `docs/planning/05-prd/05-prd.md` | F-10 |
| 영향 모듈 | `docs/planning/07-hld/07-hld.md` | M-BE-Routers, M-BE-Repos |
| 영향 엔드포인트 | `docs/planning/09-lld-api-spec/09-lld-api-spec.md` | GET /api/tags |
| 적용 컨벤션 절 | `docs/planning/11-coding-conventions/11-coding-conventions.md` | (단순 조회) |

## 1. 변경 의도

전체 태그 목록 조회.

## 2. Before / After

| 항목 | Before | After |
|---|---|---|
| routes/tags.ts | 없음 | GET / |
| app.ts | (변경) | mount /api/tags |
| 통합 테스트 | 없음 | tags.integration |

## 3. 호출자·의존자 (Call Sites)

| 위치 | 영향 | 조치 |
|---|---|---|
| FE Home sidebar | GET /api/tags | Sprint 3 |

## 4. Backward Compatibility

- Breaking: no.

## 5. Rollback 전략

- revert 가능: yes.

## 6. 비목표

(없음)
