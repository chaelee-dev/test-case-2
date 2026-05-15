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

# feat-e2e-playwright — Change Contract

## 변경 이력

| Version | Date | Author | Change |
|---|---|---|---|
| v0.1 | 2026-05-15 | yongtae.cho@bespinglobal.com | 초안 |

## 0. 참조 정본 ID (Referenced-IDs)

| 종류 | 정본 위치 | 영향 ID |
|---|---|---|
| R-ID (요구) | `docs/planning/04-srs/04-srs.md` | R-N-04 (배포·자동화) |
| F-ID (기능) | `docs/planning/05-prd/05-prd.md` | (전 영역) |
| 영향 모듈 | `docs/planning/07-hld/07-hld.md` | (전체 — E2E) |
| 영향 엔드포인트 | `docs/planning/09-lld-api-spec/09-lld-api-spec.md` | (전체) |
| 적용 컨벤션 절 | `docs/planning/13-test-design/03-regression.md` | §2 자동화 정책 |

## 1. 변경 의도

골든패스 회귀 + RISK-03 XSS 보강 + a11y 키보드.

## 2. Before / After

| 항목 | Before | After |
|---|---|---|
| e2e/tests/auth.e2e.ts | 없음 | register → /api/users로 가입 → /로 redirect |
| e2e/tests/articles.e2e.ts | 없음 | list → article 상세 |
| e2e/tests/markdown-xss.e2e.ts | 없음 | <script> payload 게시 → execute 안 됨 |
| e2e/tests/a11y-keyboard.e2e.ts | 없음 | Tab으로 NavBar 순회 |
| e2e/fixtures/seed.ts | 없음 | playwright global setup |

## 3. 호출자·의존자 (Call Sites)

| 위치 | 영향 | 조치 |
|---|---|---|
| `./devkit e2e` | playwright test | 본 PR 후 실행 가능 (BE+FE running 시) |
| CI newman + e2e job | 후속 ISS-CI-01 | BLOCKED 해소 후 |

## 4. Backward Compatibility

- Breaking: no.

## 5. Rollback 전략

- revert 가능: yes.

## 6. 비목표

- 11 골든패스 전수 — placeholder 4개로 시작, 추가 7개는 follow-up

(WBS는 11개를 명시하나 본 PR은 핵심 4개 + Sprint 4 잔여 7개로 분할)
