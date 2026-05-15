---
doc_type: scaffolding
version: v0.1 (Draft)
status: Draft
author: yongtae.cho@bespinglobal.com
date: 2026-05-15
gate: C
related:
  R-ID: [R-N-02, R-N-03, R-N-04]
  F-ID: []
  supersedes: null
---

# Conduit (RealWorld) — Scaffolding

<!-- TypeScript pnpm 워크스페이스 + React 18 (FE) + Express 4 (BE). devkit 진입점(ADR-0028). -->

## 변경 이력

| Version | Date | Author | Change |
|---|---|---|---|
| v0.1 | 2026-05-15 | yongtae.cho@bespinglobal.com | 초안 — 모노레포 트리 + Layered 패턴 + env 표 |

## 1. 디렉토리 트리

```
test-case-2/
├── devkit                                  # ADR-0028 단일 진입점 (bash 래퍼)
├── devtoolkit.config.yaml                   # commands.* 정본
├── package.json                              # pnpm workspaces root
├── pnpm-workspace.yaml
├── tsconfig.base.json                        # strict + paths alias 베이스
├── docker-compose.yml                        # frontend + backend + db
├── .env.example                              # 비밀 없음 (실 .env는 gitignore)
│
├── frontend/                                 # M-FE-* 모듈
│   ├── package.json                          # name: @conduit/frontend
│   ├── vite.config.ts                        # Vite + proxy /api → backend:3000
│   ├── tsconfig.json                         # extends ../tsconfig.base.json
│   ├── index.html
│   └── src/
│       ├── main.tsx                          # entry — Provider 합성
│       ├── App.tsx                           # RouterShell 마운트
│       ├── router/                           # M-FE-RouterShell
│       │   ├── routes.tsx
│       │   └── protectedRoute.tsx
│       ├── auth/                             # M-FE-AuthCtx
│       │   ├── AuthProvider.tsx
│       │   ├── useAuth.ts
│       │   └── tokenStorage.ts
│       ├── api/                              # M-FE-ApiClient
│       │   ├── apiClient.ts
│       │   ├── parseErrors.ts
│       │   └── endpoints/                    # 도메인별 호출 함수
│       │       ├── users.ts
│       │       ├── articles.ts
│       │       ├── profiles.ts
│       │       ├── comments.ts
│       │       └── tags.ts
│       ├── pages/                            # M-FE-Pages
│       │   ├── HomePage.tsx
│       │   ├── LoginPage.tsx
│       │   ├── RegisterPage.tsx
│       │   ├── SettingsPage.tsx
│       │   ├── EditorPage.tsx
│       │   ├── ArticlePage.tsx
│       │   ├── ProfilePage.tsx
│       │   └── NotFoundPage.tsx
│       ├── components/                       # M-FE-Components
│       │   ├── ArticleCard.tsx
│       │   ├── Pagination.tsx
│       │   ├── TagList.tsx
│       │   ├── FeedTabs.tsx
│       │   ├── CommentItem.tsx
│       │   ├── ErrorList.tsx
│       │   ├── FollowButton.tsx
│       │   └── FavoriteButton.tsx
│       ├── markdown/                         # M-FE-Markdown
│       │   ├── render.ts
│       │   └── purifyConfig.ts
│       ├── types/                            # 공유 도메인 타입 (@conduit/types로 분리 가능)
│       │   └── domain.ts
│       └── styles/
│           └── conduit.css                   # Bootstrap 4 + RealWorld 공식 CSS
│
├── backend/                                  # M-BE-* 모듈
│   ├── package.json                          # name: @conduit/backend
│   ├── tsconfig.json                         # extends ../tsconfig.base.json
│   ├── prisma/
│   │   ├── schema.prisma                     # 5 모델 + 2 M:N
│   │   └── migrations/
│   └── src/
│       ├── server.ts                         # M-BE-HttpServer (listen)
│       ├── app.ts                            # createApp() factory
│       ├── config/
│       │   ├── env.ts                        # zod 검증된 env loader
│       │   └── prisma.ts                     # Prisma Client singleton
│       ├── middleware/                       # M-BE-AuthMiddleware + 에러
│       │   ├── auth.ts                       # requireAuth, optionalAuth
│       │   ├── errorHandler.ts               # M-BE-ErrorMapper
│       │   └── requestLogger.ts              # traceId 부여
│       ├── routes/                           # M-BE-Routers
│       │   ├── users.ts
│       │   ├── profiles.ts
│       │   ├── articles.ts
│       │   ├── comments.ts
│       │   └── tags.ts
│       ├── services/                         # M-BE-*Service
│       │   ├── userService.ts
│       │   ├── articleService.ts
│       │   ├── commentService.ts
│       │   └── jwtService.ts                 # M-BE-JwtService
│       ├── repos/                            # M-BE-Repos
│       │   ├── userRepo.ts
│       │   ├── articleRepo.ts
│       │   ├── commentRepo.ts
│       │   ├── tagRepo.ts
│       │   ├── favoriteRepo.ts
│       │   ├── followRepo.ts
│       │   └── raw/                          # 원시 SQL 격리 (현재 비어 있음)
│       ├── errors/                           # 도메인 에러 클래스
│       │   ├── index.ts
│       │   └── types.ts
│       └── util/
│           ├── slug.ts                       # generateSlug
│           └── asyncHandler.ts
│
├── e2e/                                      # Playwright + Newman
│   ├── package.json                          # name: @conduit/e2e
│   ├── playwright.config.ts
│   ├── tests/
│   │   ├── auth.e2e.ts
│   │   ├── articles.e2e.ts
│   │   ├── comments.e2e.ts
│   │   ├── follow-feed.e2e.ts
│   │   ├── markdown-xss.e2e.ts
│   │   └── a11y-keyboard.e2e.ts
│   ├── newman/
│   │   ├── conduit.postman_collection.json   # RealWorld 공식 컬렉션 사본
│   │   └── run.ts                            # newman runner
│   └── fixtures/
│       └── seed.ts                           # E2E DB seed
│
└── docs/                                     # toolkit 산출(본 폴더 + 14·15)
    └── planning/
        ├── 01-project-brief/…
        ├── 06-architecture/…
        ├── 13-test-design/…
        └── INDEX.md
```

## 2. 패키지 명명 규칙

- **워크스페이스 네임스페이스**: `@conduit/<package>`. (도입 시 npm 게시 의도 없음 — private:true).
- **3 패키지**:
  - `@conduit/frontend` (`frontend/package.json`)
  - `@conduit/backend` (`backend/package.json`)
  - `@conduit/e2e` (`e2e/package.json`)
- **공유 도메인 타입**: 초기에는 `frontend/src/types/domain.ts`에 두고 BE는 자체 타입 정의. 중복이 부담되면 `@conduit/types` 패키지를 추출 (운영 단계 — ADR 신설).
- **pnpm-workspace.yaml**:
  ```yaml
  packages:
    - frontend
    - backend
    - e2e
  ```
- **루트 package.json**: 워크스페이스 스크립트 + lint·typecheck 일괄 명령만. 의존성 없음.

## 3. 디자인 패턴 결정

- **선택 패턴 (BE)**: **Layered** — Routes → Services → Repos → Prisma. 도메인이 작고(5 엔티티) 외부 통합 없으므로 Hexagonal/DDD 풀세트 과잉.
- **선택 패턴 (FE)**: Pages-Components-Hooks 분리(React 관행). 라우트 단위 페이지 컴포넌트 + 공용 컴포넌트 + 도메인 훅(`useArticle(slug)`).
- **이유**:
  - 19 엔드포인트 + 11 F-ID 규모에 Layered가 가장 적은 추상화 비용으로 책임 분리 달성.
  - Hexagonal/DDD는 외부 어댑터·도메인 이벤트가 많을 때 가치 — 본 사양은 둘 다 0.
  - FE는 React 공식 권장 “Pages + Components + Hooks”에서 벗어나지 않음.
- **금지 패턴**:
  - Active Record (도메인 객체가 직접 DB 호출) — Prisma는 Repository에 격리.
  - “Fat Controller” (라우터에 비즈니스 로직) — 라우터는 30줄 이하 권고.
  - “God Hook” (모든 상태가 단일 hook에 모임) — 도메인별 hook으로 쪼갠다.

## 4. 모듈 경계 (08-lld-module-spec와 fan-out)

| 08 모듈 ID | 12-scaffolding 위치 | 외부 노출 |
|---|---|---|
| M-FE-RouterShell | `frontend/src/router/` | App.tsx에서만 import |
| M-FE-AuthCtx | `frontend/src/auth/` | `useAuth()`만 외부 노출 |
| M-FE-ApiClient | `frontend/src/api/` | `endpoints/*` 함수만 외부 (내부 apiClient.ts는 internal) |
| M-FE-Pages | `frontend/src/pages/` | RouterShell만 import |
| M-FE-Components | `frontend/src/components/` | Pages·다른 Components가 import (재귀 금지: ESLint `import/no-cycle`) |
| M-FE-Markdown | `frontend/src/markdown/` | `render(md)`만 외부 |
| M-BE-HttpServer | `backend/src/server.ts`, `app.ts` | entry only |
| M-BE-AuthMiddleware | `backend/src/middleware/auth.ts` | Routes만 import |
| M-BE-Routers | `backend/src/routes/` | app.ts에서만 mount |
| M-BE-UserService | `backend/src/services/userService.ts` | Routes·다른 Service만 import |
| M-BE-ArticleService | `backend/src/services/articleService.ts` | Routes·다른 Service만 import |
| M-BE-CommentService | `backend/src/services/commentService.ts` | Routes만 import |
| M-BE-Repos | `backend/src/repos/` | Services만 import. Routes·Middleware는 직접 import 금지 |
| M-BE-ErrorMapper | `backend/src/middleware/errorHandler.ts` + `backend/src/errors/` | app.ts에 마운트 + 도메인에서 throw |
| M-BE-JwtService | `backend/src/services/jwtService.ts` | UserService + AuthMiddleware만 import |

## 5. 빌드·실행

```bash
# 의존성 (한 번)
pnpm install

# 환경 변수 (한 번)
cp .env.example .env
# 편집: JWT_SECRET, DATABASE_URL ('file:./conduit.db' for SQLite 또는 PG URL)

# Prisma 마이그레이션 (BE)
pnpm --filter @conduit/backend prisma migrate dev --name init

# 개발 서버 (devkit 진입점)
./devkit dev backend          # http://localhost:3000
./devkit dev frontend         # http://localhost:5173 (Vite, proxy /api → :3000)

# 빌드
./devkit build all            # frontend dist/ + backend dist/

# 테스트 (devkit)
./devkit test all             # vitest (units + integration) — 각 패키지
./devkit e2e                  # playwright + newman (Postman 회귀)

# Docker Compose (dev)
docker compose up --build     # frontend(:80) + backend(:3000) + db
```

- **devtoolkit.config.yaml** `commands:` 블록 채움 예시 (도입자 작업):
  ```yaml
  commands:
    install:
      all: "pnpm install"
      frontend: "pnpm --filter @conduit/frontend install"
      backend:  "pnpm --filter @conduit/backend install"
    build:
      all: "pnpm -r build"
      frontend: "pnpm --filter @conduit/frontend build"
      backend:  "pnpm --filter @conduit/backend build"
    test:
      all: "pnpm -r test"
      frontend: "pnpm --filter @conduit/frontend test"
      backend:  "pnpm --filter @conduit/backend test"
    dev:
      frontend: "pnpm --filter @conduit/frontend dev"
      backend:  "pnpm --filter @conduit/backend dev"
    e2e: "pnpm --filter @conduit/e2e test"
  ```

## 6. 환경 변수 / 설정 분리

| 변수 | 위치 | 기본 / 예 | 비고 |
|---|---|---|---|
| `NODE_ENV` | BE | `development` / `test` / `production` | Express + Vite 분기 |
| `PORT` | BE | `3000` | Express listen |
| `DATABASE_URL` | BE | `file:./conduit.db` (dev) / `postgresql://user:pass@db:5432/conduit` (prod) | Prisma datasource |
| `JWT_SECRET` | BE | (32바이트 이상 랜덤) | **절대 커밋 금지**. .env로만 |
| `JWT_EXP_SECONDS` | BE | `86400` (24h) | R-N-02 정합 |
| `BCRYPT_COST` | BE | `12` | R-N-02 정합 |
| `CORS_ALLOW_ORIGINS` | BE | `http://localhost:5173,https://conduit.example.com` | 쉼표 구분 화이트리스트 |
| `MAX_PAGE_LIMIT` | BE | `100` | R-F-06 정합 |
| `VITE_API_BASE` | FE | `/api` (dev에서 Vite proxy로 :3000 전달) / `https://api.example.com/api` (prod) | M-FE-ApiClient |
| `VITE_TOKEN_STORAGE_KEY` | FE | `conduit.jwt` | M-FE-AuthCtx |
| `LOG_LEVEL` | BE | `info` (prod) / `debug` (dev) | pino |

- **분리 원칙**:
  1. **민감(`JWT_SECRET`, prod DB URL)**: `.env` 로컬·시크릿 매니저(운영). 절대 git에 추가 금지(CLAUDE.md §보안).
  2. **공개(`PORT`·`MAX_PAGE_LIMIT`)**: `.env.example` 커밋 + 코드 기본값.
  3. **FE 노출 변수**: `VITE_` prefix만 브라우저에 노출됨(Vite 규약). 비밀은 절대 `VITE_*`로 두지 말 것.
- **검증**: `backend/src/config/env.ts`에서 zod 스키마로 로드 시 검증. 누락·형식 위반 시 부트스트랩 fail-fast.
