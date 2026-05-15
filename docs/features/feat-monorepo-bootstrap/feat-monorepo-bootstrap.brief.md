---
doc_type: feature-brief
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

# feat-monorepo-bootstrap — Feature Brief

<!-- Sprint 1 / Issue #1 / ISS-INFRA-01 / chore(infra). 입력: 12-scaffolding/typescript.md §1·§5. -->

## 변경 이력

| Version | Date | Author | Change |
|---|---|---|---|
| v0.1 | 2026-05-15 | yongtae.cho@bespinglobal.com | 초안 — Issue #1 부트스트랩 의도 정리 |

## 1. 한 줄 의도

빈 저장소에 pnpm 워크스페이스 + TypeScript 베이스 + Docker Compose + devkit 단일 진입점을 부트스트랩하여, 이후 모든 sprint 작업이 동일한 빌드·실행 인터페이스(`./devkit *`) 위에서 진행되도록 한다.

## 2. 사용자 가치

- **개발자**: 패키지·언어·도커 명령 다양성을 신경 쓰지 않고 `./devkit build|test|dev` 한 줄로 모든 영역 작업. 신규 합류자가 README 따라 30초 안에 개발 환경 가동.
- **CI/배포 파이프라인**: 동일 진입점을 호출하므로 yaml 미러링 부담 0. `docker compose up`이 1줄로 전체 스택 부팅.
- **본 sprint 후속 이슈**: ISS-INFRA-02(lint/format), ISS-CI-01(Actions), ISS-BE-INIT-01(Express) 등이 본 부트스트랩 산출 위에서 패키지별 작업으로 분기 가능. **본 부트스트랩 없이는 다음 이슈 진입 불가** (선수 이슈).

## 3. 현재 상태 → 변경 후 상태

| 측면 | 현재 | 변경 후 |
|---|---|---|
| 패키지 관리 | 워크스페이스 없음 — `pnpm install` 무동작 | `pnpm-workspace.yaml` + 3 패키지(`@conduit/frontend`·`backend`·`e2e`) 등록, `pnpm install` 정상 |
| 빌드 진입점 | `./devkit` 스크립트는 존재, 단 `devtoolkit.config.yaml commands.*` 빈 값 → `./devkit build`는 skip 메시지만 출력 | `commands.*` 채움 — `pnpm --filter` 명령으로 영역별 dispatch |
| TypeScript 베이스 | 없음 | `tsconfig.base.json` (strict + paths) + 각 패키지 `tsconfig.json` extends |
| Docker | 없음 | `docker-compose.yml` 3 서비스(frontend nginx:80, backend node:3000, db postgres:5432) + `docker compose config` 정상 |
| 환경변수 가이드 | 없음 | `.env.example` (시크릿 없음, 12-scaffolding §6 표 미러) |
| dev 서버 부팅 | 불가 | `./devkit dev backend` → :3000 health, `./devkit dev frontend` → :5173 Vite |

## 4. 모드 자동 감지 결과

- **mode**: add
- **근거 (ADR-0032 §2.1 결정 트리)**:
  - 시그널 1 (bug): 해당 없음 — `type:chore` 라벨, 에러 로그 없음
  - 시그널 2 (design): 해당 없음 — UI/token 키워드 없음, 본 이슈는 빌드 인프라
  - 시그널 3 (modify): 해당 없음 — *기존 동작 없음* (빈 저장소). 기존 모듈 수정·breaking change 무관
  - 시그널 4 (add 기본값): **적용** — 부정 시그널 0건, 자동 결정. `type:chore`도 신규 동작·신규 디렉토리 도입이므로 add 흐름 적용
- **결정 정합**: 신규 구조 도입 → contract에서 정당화 필요 (mode=add 원칙 "최소 침습" 적용 — 12-scaffolding §1 트리 범위를 넘지 않는다)

## 5. 영향 범위

**신규 파일 (Touched Areas: infra)**:
- `pnpm-workspace.yaml`
- 루트 `package.json` (private + workspaces 스크립트)
- `tsconfig.base.json`
- `.env.example`
- `docker-compose.yml`
- `frontend/package.json`, `frontend/tsconfig.json`, `frontend/vite.config.ts`, `frontend/index.html`, `frontend/src/main.tsx`, `frontend/src/App.tsx`
- `backend/package.json`, `backend/tsconfig.json`, `backend/src/server.ts`(최소 health 라우트)
- `e2e/package.json`, `e2e/tsconfig.json`, `e2e/playwright.config.ts`(스켈레톤)
- (단위 테스트) `backend/src/__tests__/health.test.ts`

**수정 파일**:
- `devtoolkit.config.yaml` — `commands.*` 블록 채움 (TypeScript pnpm 명령). `project`·`tech_stack`·`architecture` 블록도 본 프로젝트(react+vite+express+prisma+layered) 결정에 맞춰 갱신

**유지 (변경 없음)**:
- `devkit` 스크립트 자체 (이미 ADR-0028 정본 — config lookup 로직 유지)
- `CLAUDE.md`, `.claude/*`, `docs/planning/*`

**범위 외 (다음 이슈)**:
- ESLint·Prettier·Husky·lint-staged → ISS-INFRA-02 (#2)
- GitHub Actions CI → ISS-CI-01 (#3)
- Express 본격 미들웨어·ErrorMapper → ISS-BE-INIT-01 (#4)
- Prisma schema·migration → ISS-BE-INIT-02 (#5)
- Frontend 라우터·페이지·컴포넌트 → ISS-FE-* (Sprint 3)

## 6. 비목표

- 본 이슈는 **부트스트랩만**. 본격적 도메인 로직(R-F-*) 구현 없음 — 모든 도메인은 후속 sprint 이슈로 분리.
- BE는 `/health` 1개 라우트만 (200 OK + `{"status":"ok"}`). RealWorld API 엔드포인트 19종은 ISS-BE-* 시리즈에서 추가.
- FE는 `index.html` + `App.tsx` 더미("Conduit boot OK")만. 라우팅·페이지·인증 컨텍스트는 ISS-FE-* 시리즈에서 추가.
- Prisma 미설정 — 본 이슈는 ORM 부재로 부팅. `DATABASE_URL`은 `.env.example`에 placeholder만.
- Docker Compose에서 db 서비스는 placeholder (postgres:16-alpine 컨테이너 정의, BE가 아직 미연결). `docker compose up`은 ISS-BE-INIT-02 이후 의미 있음. 본 이슈는 `docker compose config`(파싱+dry-run) 통과만 책임.
- Newman 컬렉션은 ISS-CI-01 placeholder + Sprint 2에서 본 컬렉션.

## 7. Open Questions

- **O-1**: dev에서 SQLite vs prod에서 PostgreSQL — 본 부트스트랩에서 db 컨테이너를 PostgreSQL로 fix할지, 환경별 swap 메커니즘을 둘지? 결정: docker-compose.yml은 PostgreSQL 단일. dev sqlite는 `DATABASE_URL=file:./conduit.db`로 BE 로컬 실행 시에만. ISS-BE-INIT-02에서 schema.prisma datasource를 PostgreSQL/SQLite 양방 검증 필요 — 본 이슈 범위 외.
- **O-2**: `frontend/index.html`에 RealWorld 공식 Bootstrap 4 CSS link를 본 이슈에서 넣을지? 결정: **본 이슈에서 link만 넣음** (RealWorld 페이지 외관 검증을 Sprint 3 진입 전에 1회 확인). 내용 스타일링은 Sprint 3.
