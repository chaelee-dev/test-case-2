---
doc_type: feature-acceptance
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

# feat-lint-format-husky — Acceptance Criteria

## 변경 이력

| Version | Date | Author | Change |
|---|---|---|---|
| v0.1 | 2026-05-15 | yongtae.cho@bespinglobal.com | 초안 |

## 1. 인수 기준 (Given/When/Then)

### AC-01: ./devkit lint 통과

- Given 본 PR 머지 + `pnpm install` 완료 (husky 설치)
- When `./devkit lint` 실행
- Then frontend/backend/e2e 모두 ESLint exit 0 + Prettier --check 통과
- 측정 방법: 자동 테스트
- R-ID: R-N-04

### AC-02: pre-commit hook 위반 차단

- Given 의도적 lint 위반 라인 (`const x: any = 1`) 작성
- When `git add` + `git commit`
- Then husky pre-commit이 lint-staged 호출 → eslint --fix·prettier --write 실행 + commit 거부 (no-explicit-any 위반)
- 측정 방법: 수동 확인 (휴먼 게이트)
- R-ID: R-N-04

### AC-03: format 자동 적용

- Given Prettier 위반 라인 (들여쓰기 깨진 파일)
- When `git add` + `git commit`
- Then lint-staged가 `prettier --write` 자동 실행 후 commit 진행
- 측정 방법: 수동 확인
- R-ID: R-N-04

## 2. Definition of Done (D-06)

- [ ] 단위 테스트: (없음 — chore + 인프라). 정적 검증 4 항목으로 대체
- [ ] AI 게이트: 정적 검증 PASS
- [ ] Test Plan 4블록: PR 본문
- [ ] tested 라벨: 휴먼 게이트 후
- [ ] Approve: 1명 이상
- [ ] CI green: ISS-CI-01 미머지 → 면제

## 3. 비기능 인수

- pre-commit hook 응답 시간: 변경 파일만 lint하므로 ≤5s 권고 (lint-staged 특성).

## 4. 회귀 인수

- 기존 #1 산출(`backend/src/server.ts`·`frontend/src/App.tsx`·테스트 코드)이 본 룰셋을 위반하지 않아야 함. P10 AI 게이트에서 검증.
