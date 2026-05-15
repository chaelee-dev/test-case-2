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

# feat-lint-format-husky — Feature Brief

## 변경 이력

| Version | Date | Author | Change |
|---|---|---|---|
| v0.1 | 2026-05-15 | yongtae.cho@bespinglobal.com | 초안 |

## 1. 한 줄 의도

ESLint 9 + Prettier 3 + husky + lint-staged 도입으로 pre-commit·CI 양쪽에서 11-conventions §5 룰 자동 강제.

## 2. 사용자 가치

- 개발자: 커밋 직전 lint/format 자동 — 휴먼 검토 부담 감소.
- ISS-CI-01: CI lint job이 본 설정 그대로 호출.

## 3. 현재 상태 → 변경 후 상태

| 측면 | 현재 | 변경 후 |
|---|---|---|
| ESLint | 미설정 — 패키지 lint 스크립트 echo 스텁 | `.eslintrc.cjs` + TS/React/Import 룰셋 |
| Prettier | 미설정 | `.prettierrc` (11 §5 값) |
| pre-commit | 없음 | `.husky/pre-commit` + `lint-staged` |

## 4. 모드 자동 감지 결과

- mode: add
- 근거: ADR-0032 규칙 4 (부정 시그널 0건, type:chore 라벨)

## 5. 영향 범위

신규: `.eslintrc.cjs`, `.eslintignore`, `.prettierrc`, `.prettierignore`, `.lintstagedrc.json`, `.husky/pre-commit`. 수정: 루트·각 패키지 `package.json`.

## 6. 비목표

- CI workflow는 ISS-CI-01.
- markdownlint·stylelint는 추후 (11 §5 표 명시).

## 7. Open Questions

(없음)
