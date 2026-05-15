---
doc_type: feature-plan
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

# feat-monorepo-bootstrap — Implementation Plan

<!-- mode=add. Issue #1 / ISS-INFRA-01. Subtask 6단계 분해. ADR-0018 selective read 적용 — contract §0 기준. -->

## 변경 이력

| Version | Date | Author | Change |
|---|---|---|---|
| v0.1 | 2026-05-15 | yongtae.cho@bespinglobal.com | 초안 — 6 커밋 DAG + 테스트 매핑 + 검증 단계 |

## 1. 커밋 시퀀스 (DAG)

| # | 커밋 | 영향 파일 | 테스트 추가 | 회귀 위험 |
|---|---|---|---|---|
| 1 | `chore(infra): pnpm workspaces + root tsconfig·package (#1)` | `pnpm-workspace.yaml`, `package.json` (루트), `tsconfig.base.json`, `.env.example`, `.gitignore` 추가 (node_modules/dist/coverage/tsbuildinfo) | (없음 — 설정 파일) | 낮음 — 신규 파일, 기존 동작 0 |
| 2 | `chore(infra): backend package skeleton + /health 라우트 (#1)` | `backend/package.json`, `backend/tsconfig.json`, `backend/src/server.ts`, `backend/src/__tests__/health.test.ts`, `backend/vitest.config.ts` | `health.test.ts` (supertest 1건: GET /health → 200 + `{status:"ok"}`) | 낮음 — health 라우트만 |
| 3 | `chore(infra): frontend package skeleton + Vite·React 최소 (#1)` | `frontend/package.json`, `frontend/tsconfig.json`, `frontend/vite.config.ts`, `frontend/index.html`, `frontend/src/main.tsx`, `frontend/src/App.tsx` | (Vite 빌드 자체로 검증 — Vitest 별도 단위는 후속 ISS-FE-INIT부터) | 낮음 — 빌드 산출만 |
| 4 | `chore(infra): e2e package skeleton (#1)` | `e2e/package.json`, `e2e/tsconfig.json`, `e2e/playwright.config.ts`, `e2e/tests/.gitkeep`, `e2e/newman/.gitkeep` | (스켈레톤만 — 실제 테스트는 Sprint 3) | 낮음 |
| 5 | `chore(infra): docker-compose 3 서비스 + .dockerignore (#1)` | `docker-compose.yml`, `.dockerignore`, `frontend/Dockerfile`, `backend/Dockerfile` | (`docker compose config` 통과 — CI 빠른 검증) | 중간 — Dockerfile 빌드 실패 시 docker compose 실패. 본 이슈는 `config` dry-run만 검증, `up`은 후속 이슈에서 |
| 6 | `chore(infra): devtoolkit.config.yaml commands.* 채움 + tech_stack 갱신 (#1)` | `devtoolkit.config.yaml` (수정) | (`./devkit help`·`./devkit install all`·`./devkit dev backend` 수동 smoke) | 낮음 — config 값만, devkit 스크립트 자체는 무수정 |

## 2. 의존성 그래프

```
#1 (root tsconfig)
  ├──▶ #2 (backend skeleton, extends tsconfig.base)
  ├──▶ #3 (frontend skeleton, extends tsconfig.base)
  └──▶ #4 (e2e skeleton, extends tsconfig.base)
         │
         ▼
       #5 (docker-compose, frontend/backend Dockerfile은 #2·#3 산출 의존)
         │
         ▼
       #6 (devtoolkit.config.yaml commands.* — #2~#4 package.json scripts에 의존)
```

- **#1 선행 필수**: tsconfig.base 없으면 #2·#3·#4 모두 extends 실패.
- **#5는 #2·#3 산출 의존** (`backend/src/server.ts`·`frontend/index.html`이 Dockerfile COPY 대상).
- **#6은 마지막**: 각 패키지의 `package.json` scripts(dev/build/test)가 확정된 후 commands.*로 미러.
- **DAG 순환 없음** — 모든 의존 좌→우 단방향.
- **외부 Blocked-by**: 없음 (Sprint 1 첫 이슈).

## 3. 테스트 매핑

| 커밋 | 테스트 추가 위치 | 시나리오 |
|---|---|---|
| #2 | `backend/src/__tests__/health.test.ts` | TC-UT-BOOT-01 (단위/통합 경계): supertest로 `GET /health` 호출 → status 200 + body `{status:"ok"}` 검증. 출처: contract §2 After 행 `backend/src/server.ts`, 12-scaffolding §1 트리 보드 영역. R-N-03 (관측 부트스트랩 — health 라우트는 traceId 도입 후속이지만 부트 검증 목적). |
| #1·#3·#4·#5 | (코드 단위 테스트 없음 — 설정 파일) | 대신 §4 빌드·실행 검증 단계의 명령 실행으로 acceptance 보장. CI는 ISS-CI-01에서 추가, 본 이슈는 로컬 smoke만. |
| #6 | (없음) | `./devkit help`·`./devkit install all` 실행이 §4 단계 11·12에 포함 |

커버리지 목표: 본 이슈는 부트스트랩 — 코드 로직 거의 0이므로 커버리지 보다는 §4 검증 단계 13개 모두 PASS가 acceptance. 후속 이슈(#4 BE-INIT-01부터)에서 13-test-design/01-strategy.md §1 커버리지 ≥80% 적용.

## 4. 빌드·실행 검증 단계

```bash
# [전제 조건]
# Node 20+, pnpm 9+ (corepack enable && corepack prepare pnpm@9 --activate), Docker 24+

# [단계 1] 의존성 부트스트랩
pnpm install
# 기대: 3 패키지(@conduit/frontend, @conduit/backend, @conduit/e2e) 모두 install. lockfile 생성

# [단계 2] 루트 typecheck
pnpm -r typecheck
# 기대: TS error 0. strict 모드 위반 없음

# [단계 3] devkit help
./devkit help
# 기대: 도움말 출력 + exit 0

# [단계 4] devkit install 멱등
./devkit install all
# 기대: pnpm install 재실행. lockfile 변화 없음

# [단계 5] backend 단위 테스트
./devkit test backend
# 기대: vitest run — health.test.ts 1 PASS

# [단계 6] backend dev 서버
./devkit dev backend &
sleep 3
curl -sS http://localhost:3000/health
# 기대: {"status":"ok"} + HTTP 200
kill %1

# [단계 7] frontend dev 서버
./devkit dev frontend &
sleep 3
curl -sS http://localhost:5173 | grep -q "<!doctype html"
# 기대: Vite가 HTML 응답
kill %1

# [단계 8] backend build
./devkit build backend
# 기대: backend/dist/server.js 생성

# [단계 9] frontend build
./devkit build frontend
# 기대: frontend/dist/index.html + assets 생성

# [단계 10] docker compose 파싱
docker compose config > /dev/null
# 기대: exit 0

# [단계 11] docker compose 이미지 빌드 (옵션 — 무거움)
# 본 이슈 acceptance 외. Sprint 1 종료 후 실증
# docker compose build

# [단계 12] devkit e2e (스켈레톤 동작 확인)
./devkit e2e
# 기대: playwright가 실행되나 테스트 0건 또는 placeholder만 — exit 0 또는 "no tests found"는 허용

# [단계 13] gitignore 확인
git status
# 기대: node_modules, dist, .env, *.tsbuildinfo, coverage 모두 untracked 미표시
```

## 5. 점진 합의 / 결정 발생 항목

- **ADR 작성 필요: no** — mode=add이고 12-scaffolding §1·§5가 이미 결정 정본. 본 이슈는 결정 산출이 아니라 결정 적용. ADR 신설은 후속 이슈에서 결정 변경 발생 시(예: pnpm → yarn berry 전환, postgres → mysql, layered → hexagonal 등).
- **결정 변경 잠재 항목 (본 이슈에서 적용만, 변경 시 ADR 필수)**:
  - pnpm 버전 9 (변경 시 ADR — 8 호환 워크스페이스 문법 차이)
  - TypeScript 5 + `moduleResolution: bundler` (변경 시 ADR — node/classic은 Vite 호환성 영향)
  - Node 20 LTS (변경 시 ADR — 22로 올릴 때 영향)
  - Docker Compose v2 `services.*.depends_on` 헬스체크 형식 (compose v3 transition 시 ADR)
- **점진 합의가 필요한 항목 (본 이슈 외, sprint 1~2에 걸쳐 점진 확정)**:
  - dev에서 SQLite vs PostgreSQL — ISS-BE-INIT-02에서 결정. 본 이슈는 `.env.example`에 둘 다 주석으로 제시
  - JWT_SECRET 형식 (32바이트 hex vs base64) — ISS-BE-AUTH-01에서 결정
  - CORS_ALLOW_ORIGINS 운영 값 — Sprint 3 배포 직전 결정. 본 이슈는 dev 값(`http://localhost:5173`)만
- **점진 합의 추적**: 본 이슈 머지 후 sprint 1 종료까지 위 항목들이 후속 이슈에서 ADR로 fix됨. 본 이슈에서는 deferred로 명시.
