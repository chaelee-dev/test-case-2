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

# feat-lint-format-husky — Change Contract

## 변경 이력

| Version | Date | Author | Change |
|---|---|---|---|
| v0.1 | 2026-05-15 | yongtae.cho@bespinglobal.com | 초안 |

## 0. 참조 정본 ID (Referenced-IDs)

| 종류 | 정본 위치 | 영향 ID |
|---|---|---|
| R-ID (요구) | `docs/planning/04-srs/04-srs.md` | R-N-04 (배포·자동 품질 게이트) |
| F-ID (기능) | `docs/planning/05-prd/05-prd.md` | (none) |
| 영향 모듈 | `docs/planning/07-hld/07-hld.md` | (none) — 빌드/품질 인프라 |
| 영향 엔드포인트 | `docs/planning/09-lld-api-spec/09-lld-api-spec.md` | (none) |
| 적용 컨벤션 절 | `docs/planning/11-coding-conventions/11-coding-conventions.md` | §3 보강 / §5 Lint·포맷 표 / §6 Import 정책 |

## 1. 변경 의도

pre-commit + CI 두 단계에서 lint·format 자동 강제. 11-conventions §5 도구 4종(ESLint 9 / Prettier 3 / husky / lint-staged) 도입.

## 2. Before / After

| 항목 | Before | After |
|---|---|---|
| `.eslintrc.cjs` | 없음 | 신규 (TS strict + react + react-hooks + import + prettier 충돌 회피) |
| `.eslintignore` | 없음 | 신규 (dist/node_modules/coverage/*.config.{js,ts}) |
| `.prettierrc` | 없음 | 신규 (singleQuote/semi/printWidth 100/trailingComma all/arrowParens always) |
| `.prettierignore` | 없음 | 신규 (dist·node_modules·.husky·pnpm-lock.yaml) |
| `.lintstagedrc.json` | 없음 | 신규 (*.{ts,tsx,js,jsx} → eslint --fix + prettier --write) |
| `.husky/pre-commit` | 없음 | 신규 (`pnpm exec lint-staged`) |
| 루트 `package.json` devDeps | 없음 | 신규 (eslint 9 + prettier 3 + husky 9 + lint-staged 15 + TS-ESLint plugin/parser + react/hooks/import plugin + config-prettier) |
| 루트 `package.json` scripts | lint 스텁 | lint·format·prepare·typecheck 정상 명령 |
| 각 패키지 `package.json` scripts.lint | 없음 | `eslint . --max-warnings 0` |

## 3. 호출자·의존자 (Call Sites)

| 위치 | 영향 | 조치 |
|---|---|---|
| `git commit` | husky pre-commit 자동 실행 | 1회 `pnpm install`로 husky 설치 후 자동 |
| ISS-CI-01 CI | `pnpm -w lint` 호출 예정 | 후속 이슈에서 본 명령 사용 |
| `./devkit lint` | devtoolkit.config.yaml commands.frontend.lint | 본 이슈 후 정상 동작 |

## 4. Backward Compatibility

- Breaking: no — 신규 파일·devDeps만, 코드 무수정.
- 마이그레이션 필요: no — `pnpm install` 1회로 husky 자동 설치 (prepare hook).

## 5. Rollback 전략

- revert 가능: yes — `git revert -m 1 <merge>` + 로컬 `.husky/` 정리.
- rollback 절차: 단순 revert + `.husky/` rm.
- 데이터 손상 위험: 없음.

## 6. 비목표

- CI workflow는 ISS-CI-01.
- markdownlint·stylelint 추후.
