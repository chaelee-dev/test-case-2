---
doc_type: feature-contract
version: v0.1
status: Draft
author: yongtae.cho@bespinglobal.com
date: 2026-05-15
gate: feature
related:
  R-ID: [R-N-02, R-N-03, R-N-04]
  F-ID: []
  supersedes: null
---

# feat-monorepo-bootstrap — Change Contract

<!-- mode=add. Issue #1 / ISS-INFRA-01. 빈 저장소 → pnpm workspaces + devkit commands + docker-compose. -->

## 변경 이력

| Version | Date | Author | Change |
|---|---|---|---|
| v0.1 | 2026-05-15 | yongtae.cho@bespinglobal.com | 초안 — Before/After 파일 매트릭스 + Rollback 전략 |

## 0. 참조 정본 ID (Referenced-IDs)

> ADR-0018 — 코드 수정 직전 selective read를 위한 정본 ID 표.

| 종류 | 정본 위치 | 영향 ID |
|---|---|---|
| R-ID (요구) | `docs/planning/04-srs/04-srs.md` | R-N-02 (보안: bcrypt cost·JWT exp), R-N-03 (관측: traceId·로그 레벨), R-N-04 (배포: Docker Compose 1줄 실행) |
| F-ID (기능) | `docs/planning/05-prd/05-prd.md` | (none) — 본 이슈는 infra chore. 도메인 F-ID 매핑 후속 이슈에 위임 |
| 영향 모듈 | `docs/planning/07-hld/07-hld.md` | (none) — 모듈 구현 0. 패키지 경계만 확정 (M-FE-* / M-BE-* 디렉토리는 후속 이슈에서 채움) |
| 영향 엔드포인트 | `docs/planning/09-lld-api-spec/09-lld-api-spec.md` | `GET /health` (placeholder, 09 LLD에 명시 없음 — bootstrap 검증용. 후속 ISS-BE-INIT-01에서 RealWorld 19 엔드포인트로 확장) |
| 적용 컨벤션 절 | `docs/planning/11-coding-conventions/11-coding-conventions.md`, `docs/planning/12-scaffolding/typescript.md` | 12-scaffolding §1 트리·§5 빌드·§6 env 표 / 11-conventions §1 TS strict |

## 1. 변경 의도

빈 저장소 위에 모든 후속 이슈가 올라탈 **단일 빌드 인터페이스(`./devkit`)** + **TypeScript pnpm 워크스페이스** + **로컬 통합 환경(`docker compose`)**를 구축한다. 본 변경 후에는 (a) `pnpm install`이 3 패키지를 부트스트랩하고, (b) `./devkit dev backend`로 `:3000` health 응답이 나오며, (c) `./devkit dev frontend`로 `:5173` Vite가 부팅하고, (d) `docker compose config`가 파싱 오류 없이 통과한다.

## 2. Before / After

| 항목 | Before | After |
|---|---|---|
| `pnpm-workspace.yaml` | (없음) | 생성 — `packages: [frontend, backend, e2e]` |
| 루트 `package.json` | (없음) | 생성 — `private: true`, name `conduit-monorepo`, scripts `lint`/`typecheck` placeholder |
| `tsconfig.base.json` | (없음) | 생성 — `strict: true`, `target: ES2022`, `module: ESNext`, `moduleResolution: bundler`, paths alias 베이스 |
| `.env.example` | (없음) | 생성 — 12-scaffolding §6 표 13 변수 (시크릿 값 없이 키만, JWT_SECRET은 `CHANGE_ME_TO_32_BYTE_RANDOM` 가이드) |
| `docker-compose.yml` | (없음) | 생성 — services: frontend(nginx:alpine, :80), backend(node:20-alpine, :3000), db(postgres:16-alpine, :5432). volumes/network 정의 |
| `frontend/package.json` | (없음) | 생성 — `@conduit/frontend`, deps: react^18, react-dom^18, vite^5, typescript^5. scripts: dev/build/test/preview |
| `frontend/vite.config.ts` | (없음) | 생성 — port 5173, proxy `/api → http://localhost:3000` |
| `frontend/tsconfig.json` | (없음) | 생성 — extends `../tsconfig.base.json`, JSX react |
| `frontend/index.html` | (없음) | 생성 — RealWorld Bootstrap 4 CDN link + `<div id="root">` |
| `frontend/src/main.tsx` | (없음) | 생성 — ReactDOM.createRoot 마운트 |
| `frontend/src/App.tsx` | (없음) | 생성 — "Conduit boot OK" 더미 |
| `backend/package.json` | (없음) | 생성 — `@conduit/backend`, deps: express^4, deps 최소. scripts: dev(`tsx watch`), build(`tsc`), start, test(`vitest run`) |
| `backend/tsconfig.json` | (없음) | 생성 — extends `../tsconfig.base.json`, outDir `dist`, target Node20 |
| `backend/src/server.ts` | (없음) | 생성 — Express boot + `GET /health` 200 `{status:"ok"}` |
| `backend/src/__tests__/health.test.ts` | (없음) | 생성 — supertest로 /health 200 검증 (단위/통합 경계 — 후속 ISS-BE-INIT-01에서 본격 통합 테스트 도입) |
| `e2e/package.json` | (없음) | 생성 — `@conduit/e2e`, deps: @playwright/test^1.43, newman^6. scripts: test(playwright), newman:placeholder |
| `e2e/playwright.config.ts` | (없음) | 생성 — baseURL `http://localhost:5173`, projects chromium만 (sprint 3 종료 시 firefox/webkit 추가) |
| `e2e/tsconfig.json` | (없음) | 생성 — extends `../tsconfig.base.json` |
| `devtoolkit.config.yaml` | `commands.*` 빈 값, `tech_stack.backend.framework: springboot` (default) | `commands.frontend/backend/e2e` 채움 (pnpm --filter 명령). `tech_stack` 본 프로젝트 결정 반영 (react+vite+express+prisma, 단 일부 default는 유지). `architecture.backend.pattern: layered` 명시 |

## 3. 호출자·의존자 (Call Sites)

| 위치 | 영향 | 조치 |
|---|---|---|
| `devkit` (스크립트) | `devtoolkit.config.yaml commands.*` lookup — 빈 값일 때 skip 메시지 출력 | 본 이슈에서 변경 없음. config 채움만으로 명령이 동작 |
| `/implement` Phase 호출 | `./devkit build all` 등을 호출 (12-scaffolding §5) | 본 이슈에서 channel만 설정. 후속 이슈에서 본격 사용 |
| 후속 이슈 (#2 lint·#3 CI·#4 BE·…) | `pnpm-workspace.yaml` + 각 패키지 `package.json` 의존 | 본 이슈가 부트스트랩한 구조 위에서 추가 작업. 본 이슈 변경 후 1회 `pnpm install` 권고 |
| 사용자(개발자) | `./devkit help` / `docker compose config` | 본 이슈 후 즉시 실행 가능 |
| CI (ISS-CI-01에서 추가) | (아직 없음) | ISS-CI-01에서 본 부트스트랩 위에 `.github/workflows/ci.yml` 추가 |

## 4. Backward Compatibility

- **Breaking: no** — 빈 저장소(도구·설정 외 코드 0)에 신규 파일 추가만. 기존 기능 0건 → 기존 동작 영향 0.
- **마이그레이션 필요: no** — 첫 도입이므로 사용자 데이터·외부 시스템 상태 없음. 신규 합류자는 `pnpm install` 1회 + `cp .env.example .env` 1회만.
- **deprecation 경로**: N/A (deprecate할 기존 동작 없음).
- **(참고) 본 부트스트랩이 *이후* 변경될 때**: 패키지 추가·제거는 `pnpm-workspace.yaml` 변경 + ADR 필수. `devtoolkit.config.yaml commands.*` 시그니처 변경은 `/implement` Phase 호출자에게 breaking이므로 modify 흐름 + ADR 필수.

## 5. Rollback 전략

- **revert 가능: yes** — 단일 PR 머지 산출이므로 `git revert <merge-commit>` 1회로 전체 부트스트랩 원복.
- **rollback 절차**:
  1. `git revert -m 1 <merge-commit-sha>` (머지 커밋 revert, `-m 1`으로 base 부모 보존)
  2. `gh pr create --title "revert: monorepo bootstrap (#1)" --body "Reverts #1 — <사유>"`
  3. 후속 머지된 sprint 작업이 있으면 *역순*으로 revert (예: #2 lint setup이 머지된 상태라면 #2 revert가 선행)
  4. revert 후에는 `.gitignore`에 남은 빌드 산출(`node_modules`, `dist`, `*.tsbuildinfo`)을 로컬에서 수동 정리
- **데이터 손상 위험**: 없음 — DB 마이그레이션 0, persistent volume 0 (docker-compose는 정의만, 본 이슈에서 `docker compose up` 미실행). `.env`는 gitignore이므로 사용자 로컬 시크릿은 revert와 무관하게 보존.

## 6. 비목표

- Lint·Format·Husky·CI는 본 이슈 범위 외 (각각 #2·#2·#2·#3). 본 이슈는 *부트스트랩만*.
- BE 도메인 로직(인증·게시글·코멘트 등)은 #4 이후 sprint 1 BE 이슈에서 추가. 본 이슈의 `server.ts`는 `/health` placeholder 1개만.
- FE 라우터·페이지·인증 컨텍스트는 Sprint 3 진입 시 추가. 본 이슈의 `App.tsx`는 "Conduit boot OK" 더미 1개만.
- Prisma schema·migration은 ISS-BE-INIT-02. 본 이슈에서 `backend/prisma/` 디렉토리 생성하지 않음.
- ESLint·Prettier 의존성을 `package.json`에 미리 추가하지 않음 (ISS-INFRA-02 책임).
- Newman 컬렉션은 ISS-CI-01 placeholder + Sprint 2 본 컬렉션. 본 이슈는 `e2e/package.json`에 newman dep만.
- 본격 통합 테스트(`backend/src/__tests__/integration/*`)는 ISS-BE-INIT-01. 본 이슈는 health 단위 1건만.
