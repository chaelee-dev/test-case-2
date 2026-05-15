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

# feat-e2e-playwright — Feature Brief

## 변경 이력

| Version | Date | Author | Change |
|---|---|---|---|
| v0.1 | 2026-05-15 | yongtae.cho@bespinglobal.com | 초안 |

## 1. 한 줄 의도

Playwright E2E 골든패스 + XSS payload + 키보드 a11y.

## 2. 사용자 가치

전체 흐름 회귀.

## 3. 현재 상태 → 변경 후 상태

| 측면 | 현재 | 변경 후 |
|---|---|---|
| E2E 테스트 | .gitkeep만 | 6 골든패스 + XSS + 키보드 a11y |

## 4. 모드 자동 감지 결과

- mode: add
- 근거: ADR-0032 규칙 4 (type:test)

## 5. 영향 범위

신규: e2e/tests/auth·articles·comments·follow-feed·markdown-xss·a11y-keyboard.e2e.ts, e2e/fixtures/seed.ts.

## 6. 비목표

- CI 통합 — ISS-CI-01 BLOCKED 해소 후.

## 7. Open Questions

(없음)
