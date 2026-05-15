---
doc_type: feature-brief
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

# feat-ci-baseline — Feature Brief

## 변경 이력

| Version | Date | Author | Change |
|---|---|---|---|
| v0.1 | 2026-05-15 | yongtae.cho@bespinglobal.com | 초안 — OAuth workflow scope 회피 모드 |

## 1. 한 줄 의도

GitHub Actions workflow 템플릿 + 사용자 1회 활성화 안내. OAuth `workflow` scope 미부여로 자동 머지 PR이 직접 `.github/workflows/*` push 불가 → 템플릿을 `docs/planning/operations/`에 두고 사용자가 1회 복사·푸시.

## 2. 사용자 가치

- 후속 PR 자동 CI 검증.
- ISS-CI-01 BLOCKED 상태 해소 경로 제공.

## 3. 현재 상태 → 변경 후 상태

| 측면 | 현재 | 변경 후 |
|---|---|---|
| ci.yml | 없음 | `docs/planning/operations/ci-workflow-template.yml` (템플릿) |
| 활성화 | 없음 | 사용자 1회 작업 안내 (PR body) |

## 4. 모드 자동 감지 결과

- mode: add
- 근거: ADR-0032 규칙 4 (type:chore)

## 5. 영향 범위

신규: `docs/planning/operations/ci-workflow-template.yml`, `docs/features/feat-ci-baseline/`. 후속 사용자 작업으로 `.github/workflows/ci.yml` 활성.

## 6. 비목표

- 자동 ci.yml push — OAuth 한계로 불가.

## 7. Open Questions

(없음)
