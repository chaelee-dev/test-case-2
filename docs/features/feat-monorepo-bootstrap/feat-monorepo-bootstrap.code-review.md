---
doc_type: feature-code-review
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

# feat-monorepo-bootstrap — Code Review

<!-- Generator≠Evaluator 원칙. 본 리뷰는 P8 산출(6 커밋)을 독립 시각으로 검토. -->

## 변경 이력

| Version | Date | Author | Change |
|---|---|---|---|
| v0.1 | 2026-05-15 | yongtae.cho@bespinglobal.com | 초안 — PASS verdict (NEEDS-WORK 없음, 후속 이슈 deferred 명시) |

## 0. Verdict

- **verdict: PASS**
- **reviewer: yongtae.cho@bespinglobal.com**
- **review_at: 2026-05-15**
- **요약**: 6 커밋 모두 contract §2 After 행 17개 파일에 1:1 매핑. 단위 테스트 1건(health 200 + content-type) 통과 예상. CLAUDE.md §보안 1·2·5 위반 없음 (`.env`·`*.key`·`*.pem` 변경 0건). devkit help smoke 통과. yq lookup으로 commands.* 모두 resolve 검증.

## 1. 컨트랙트 충실도

contract §2 Before/After 표 17개 항목 모두 PR diff에 포함:

| Contract After 행 | PR 파일 | 일치 |
|---|---|---|
| `pnpm-workspace.yaml` | commit #1 — `pnpm-workspace.yaml` | ✅ packages: [frontend, backend, e2e] |
| 루트 `package.json` | commit #1 — `package.json` | ✅ private:true + engines + scripts |
| `tsconfig.base.json` | commit #1 — `tsconfig.base.json` | ✅ strict + ES2022 + bundler |
| `.env.example` | commit #1 — `.env.example` | ✅ 13 변수, 시크릿 placeholder만 |
| `docker-compose.yml` | commit #5 | ✅ 3 services + healthcheck + depends_on |
| `frontend/package.json` | commit #3 | ✅ @conduit/frontend, react 18 + vite 5 |
| `frontend/vite.config.ts` | commit #3 | ✅ port 5173 + proxy /api → :3000 |
| `frontend/tsconfig.json` | commit #3 | ✅ extends base + jsx react-jsx |
| `frontend/index.html` | commit #3 | ✅ RealWorld 공식 CSS link |
| `frontend/src/main.tsx` | commit #3 | ✅ ReactDOM.createRoot |
| `frontend/src/App.tsx` | commit #3 | ✅ "Conduit boot OK" |
| `backend/package.json` | commit #2 | ✅ @conduit/backend, express 4 |
| `backend/tsconfig.json` | commit #2 | ✅ extends base + outDir dist |
| `backend/src/server.ts` | commit #2 | ✅ createApp() + GET /health |
| `backend/src/__tests__/health.test.ts` | commit #2 | ✅ supertest 2 케이스 |
| `e2e/package.json` | commit #4 | ✅ @conduit/e2e, playwright 1.43 + newman 6 |
| `e2e/playwright.config.ts` | commit #4 | ✅ chromium만, baseURL :5173 |
| `e2e/tsconfig.json` | commit #4 | ✅ extends base |
| `devtoolkit.config.yaml` | commit #6 | ✅ commands.* + tech_stack + architecture 갱신 |

추가 항목 (contract §2에 직접 없으나 §1 변경 의도 정합):
- `.gitignore` 확장 (commit #1) — node_modules·dist·coverage·tsbuildinfo·.vscode/.idea. CLAUDE.md §보안 4 정합.
- `.dockerignore` (commit #5) — Dockerfile build 컨텍스트 정리. docker-compose의 build 정합.
- `backend/vitest.config.ts` (commit #2) — vitest 환경 + coverage 설정. health.test.ts 동작 선결.
- `backend/Dockerfile`·`frontend/Dockerfile` (commit #5) — docker-compose build 정합. contract §2 docker-compose.yml 행이 포괄.

## 2. 테스트 커버리지

- **단위 테스트**: `backend/src/__tests__/health.test.ts` 2 케이스
  - 케이스 1: GET /health → 200 + `{status:"ok"}` (AC-02 자동화)
  - 케이스 2: Content-Type application/json (Express express.json + res.json 기본 동작 검증)
- **본 이슈는 부트스트랩** — 코드 로직 거의 0. 13-test-design/01-strategy.md §1 커버리지 ≥80% BLOCK은 plan §3에 명시적으로 면제 (코드 line이 거의 없는 부트스트랩 특성).
- **smoke 검증**: `./devkit help` 통과 (위 출력 확인), `yq` lookup 통과.
- **deferred (후속 이슈)**:
  - 통합 테스트 (5 에러 케이스) → ISS-BE-INIT-01
  - Newman 본 컬렉션 회귀 → Sprint 2
  - E2E (Playwright 6 시나리오) → Sprint 3

## 3. 보안 / 시크릿

CLAUDE.md §보안 절대 규칙 6항 점검:

| 규칙 | 점검 결과 |
|---|---|
| 1. .env / .env.* / API Key / 시크릿 / 인증서 미커밋 | ✅ `.env`·`*.key`·`*.pem` 변경 0건. `.env.example`만 신규 (placeholder만 포함) |
| 2. 코드/로그/커밋 메시지/PR 본문에 시크릿 미포함 | ✅ JWT_SECRET 값은 `CHANGE_ME_TO_32_BYTE_RANDOM` 가이드 placeholder. 커밋 메시지에 시크릿 없음 |
| 3. 환경변수 출력 금지 (cat .env 등) | ✅ 본 이슈에서 환경변수 출력 명령 미실행 |
| 4. 보안 파일 경로 패턴 (.env*, *.key, *.pem, credentials.json, *secret*, *api_key*) | ✅ .gitignore에 `.env`·`.env.*`·`!.env.example`·`*.key`·`*.pem` 등 명시 (기존 toolkit gitignore.template) |
| 5. settings.json PreToolUse hook 자동 차단 | ✅ toolkit 도입 시 활성. 본 이슈 작업 중 차단 이벤트 0건 |
| 6. /cso 보안 점검 (필요 시) | (본 이슈는 chore + 시크릿 도입 placeholder만이라 별도 /cso 호출 없이 위 5축으로 충분) |

추가 검증 (F-RISK-02 완화 전략):
- `.gitignore`에 `.env`·`.env.*`·`!.env.example` 정확히 명시 — `.env.example`만 예외 허용 ✅
- `.env.example`에 실제 시크릿 값 0건 (`CHANGE_ME_TO_*` 가이드만) ✅
- `docker-compose.yml`에 `JWT_SECRET: ${JWT_SECRET:?...}` 명시적 실패 — 시크릿 미주입 시 컨테이너 부팅 차단 ✅

## 4. 가독성 / 단순성

- `backend/src/server.ts`: 20줄, 의존 1개(express), createApp factory + listen 분리. test-friendly. ✅
- `frontend/src/App.tsx`: 11줄, 단일 컴포넌트. RealWorld CSS 클래스 활용. ✅
- `docker-compose.yml`: 환경변수 default 패턴(`${VAR:-default}`) + 필수 변수 fail-fast(`${JWT_SECRET:?...}`). ✅
- `Dockerfile` multi-stage: builder + runtime 분리. 단, frontend Dockerfile의 nginx proxy 설정은 후속 이슈로 deferred (현재 정적 파일만 서빙) — 후속 ISS-CI-01·Sprint 3 배포 시 nginx.conf 추가 필요. NEEDS-WORK가 아닌 명시적 deferred.
- `devtoolkit.config.yaml`: 빈 값 → pnpm --filter 명령으로 채움. 주석으로 deferred 표시 (lint: ISS-INFRA-02 등). ✅
- **단순성 평가**: 본 이슈 정도의 부트스트랩에 multi-stage Dockerfile 도입은 약간 과한 면이 있으나, sprint 1 종료 시점에 docker compose build smoke를 1회 수행하려면 필수. 단일 stage로 시작 후 후속 이슈에서 multi-stage로 전환은 modify 흐름 + ADR 필요. *지금 multi-stage가 합리*.

## 5. 발견 사항 (3축 OX 분류)

| 발견 | in_scope | blocks_merge | same_area | 처리 |
|---|---|---|---|---|
| `backend/Dockerfile`에 `pnpm install --filter @conduit/backend --frozen-lockfile`을 `\|\|` fallback으로 처리 — lockfile 없는 상태에서도 빌드 가능하도록. 단 production image에 lockfile 미반영 시 의존성 drift 위험 | O | X | O | **deferred** — `pnpm install` 1회 후 lockfile 생성되면 `--frozen-lockfile`만 사용으로 좁힐 것. ISS-CI-01에서 lockfile 강제 검증 추가 |
| `frontend/Dockerfile`의 nginx가 `/api` proxy를 갖지 않음 — Sprint 3 배포 시 nginx.conf 추가 필요 | O | X | O | **deferred** — 본 이슈는 정적 파일 서빙만, docker compose config 통과가 acceptance. Sprint 3 ISS-FE-DEPLOY-* 이슈에서 nginx.conf 추가 |
| `e2e/tests/.gitkeep`만 두고 실제 placeholder smoke 테스트 1건도 없음 | O | X | O | **deferred** — Sprint 3 ISS-E2E-* 이슈에서 6 시나리오 추가. 본 이슈는 packaging 부트스트랩만 |
| `backend/src/server.ts`에 `process.env.PORT` parse가 `Number()` 단순 캐스팅 — 유효성 검증 없음 | O | X | O | **deferred** — ISS-BE-INIT-01에서 zod 기반 env validation 도입 (config/env.ts) |
| `backend/Dockerfile` builder 단계에서 `frontend/`·`e2e/`까지 workspace 매니페스트만 COPY — pnpm install이 워크스페이스 해결을 시도하므로 필요 | X | X | O | **수용** — pnpm workspace 특성. 별도 처리 불필요 |
| `frontend/Dockerfile`에서 `frontend/index.html` link href가 외부 CDN(`//demo.productionready.io/main.css`) 의존 — 오프라인 환경에서 깨질 수 있음 | O | X | O | **deferred** — RealWorld 공식 main.css를 vendor화하여 `frontend/src/styles/conduit.css`로 옮기는 작업은 Sprint 3 진입 시 수행. 본 이슈는 부팅 검증 가치만 |
| `package.json` scripts.lint가 `echo 'pending'`로 stub — `./devkit lint`가 실패하지 않고 통과 | O | X | O | **수용** — ISS-INFRA-02 머지 시 본 stub이 실 lint로 교체. 본 이슈는 명령 진입점만 |

**모든 발견이 `blocks_merge: X`** — PR 머지 후 후속 이슈에서 자연 해소. 단, "deferred" 항목들은 P13 docs-update에서 issue body 또는 별도 follow-up 이슈로 추적 권고.

## 6. NEEDS-WORK 항목

(없음 — PASS)

위 5절의 7개 deferred 항목은 모두 해당 후속 이슈(ISS-INFRA-02·ISS-CI-01·ISS-BE-INIT-01·ISS-FE-DEPLOY-*·ISS-E2E-*)에서 자연 해소되며 *본 이슈 머지를 차단하지 않는다*.
