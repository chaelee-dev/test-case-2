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

# feat-ops-retro — Change Contract

## 변경 이력

| Version | Date | Author | Change |
|---|---|---|---|
| v0.1 | 2026-05-15 | yongtae.cho@bespinglobal.com | 초안 |

## 0. 참조 정본 ID (Referenced-IDs)

| 종류 | 정본 위치 | 영향 ID |
|---|---|---|
| R-ID (요구) | `docs/planning/04-srs/04-srs.md` | R-N-04 |
| F-ID (기능) | `docs/planning/05-prd/05-prd.md` | (none) |
| 영향 모듈 | `docs/planning/07-hld/07-hld.md` | (none) |
| 영향 엔드포인트 | `docs/planning/09-lld-api-spec/09-lld-api-spec.md` | (none) |
| 적용 컨벤션 절 | `docs/planning/15-risk/15-risk.md` | §3 진행 표 |

## 1. 변경 의도

Sprint 1~3 회고 + 운영 docs.

## 2. Before / After

| 항목 | Before | After |
|---|---|---|
| docs/planning/retro/2026-05-15-sprint-retro.md | 없음 | 신규 |
| docs/planning/operations/docker-compose-runbook.md | 없음 | 신규 (실행/문제해결) |
| docs/planning/15-risk/15-risk.md | RISK-03 진행 | RISK-03 완료 ✅ |

## 3. 호출자·의존자 (Call Sites)

(없음)

## 4. Backward Compatibility

- Breaking: no.

## 5. Rollback 전략

- revert 가능: yes (docs only).

## 6. 비목표

- ci.yml 갱신 — 후속.
