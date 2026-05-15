---
doc_type: feature-contract
version: v0.1
status: Draft
author: yongtae.cho@bespinglobal.com
date: 2026-05-15
gate: feature
related:
  R-ID: [R-N-04]
  F-ID: []
  supersedes: null
---

# feat-ci-baseline — Change Contract

## 변경 이력

| Version | Date | Author | Change |
|---|---|---|---|
| v0.1 | 2026-05-15 | yongtae.cho@bespinglobal.com | 초안 |

## 0. 참조 정본 ID (Referenced-IDs)

| 종류 | 정본 위치 | 영향 ID |
|---|---|---|
| R-ID (요구) | `docs/planning/04-srs/04-srs.md` | R-N-04 (배포·자동 품질 게이트) |
| F-ID (기능) | `docs/planning/05-prd/05-prd.md` | (none) |
| 영향 모듈 | `docs/planning/07-hld/07-hld.md` | (none) — CI 인프라 |
| 영향 엔드포인트 | `docs/planning/09-lld-api-spec/09-lld-api-spec.md` | (none) |
| 적용 컨벤션 절 | `docs/planning/13-test-design/03-regression.md` | §2 자동화 정책 |

## 1. 변경 의도

OAuth scope 한계 회피를 위한 템플릿 방식 — 사용자 1회 수동 활성화.

## 2. Before / After

| 항목 | Before | After |
|---|---|---|
| `docs/planning/operations/ci-workflow-template.yml` | 없음 | 4 job (lint·typecheck·test·newman) 템플릿 |
| 사용자 작업 후 `.github/workflows/ci.yml` | (없음) | 활성 |

## 3. 호출자·의존자 (Call Sites)

| 위치 | 영향 | 조치 |
|---|---|---|
| 모든 PR | 활성화 후 자동 트리거 | `cp docs/planning/operations/ci-workflow-template.yml .github/workflows/ci.yml` |

## 4. Backward Compatibility

- Breaking: no — docs only (사용자 활성화 전).

## 5. Rollback 전략

- revert 가능: yes (docs).
- 활성화 후 rollback: `.github/workflows/ci.yml` 삭제.

## 6. 비목표

- 자동 활성화 — OAuth 한계.
