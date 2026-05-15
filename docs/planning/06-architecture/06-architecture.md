---
doc_type: architecture
version: v0.1 (Draft)
status: Draft
author: yongtae.cho@bespinglobal.com
date: 2026-05-15
gate: C
related:
  R-ID: [R-F-01, R-F-08, R-F-17, R-N-01, R-N-02, R-N-03, R-N-05]
  F-ID: [F-01, F-03, F-06, F-11]
  supersedes: null
---

# Conduit (RealWorld) — System Architecture

<!-- Gate C — ADR-0031: 06은 Architecture 본체(시스템 컨텍스트·Stack·컨테이너 구조)만 담는다.
     모듈 분해는 07 HLD §1로 이전. -->

## 변경 이력

| Version | Date | Author | Change |
|---|---|---|---|
| v0.1 | 2026-05-15 | yongtae.cho@bespinglobal.com | 초안 — Stack(TS/React+Vite/Node+Express/Prisma) 결정, 2-컨테이너 구조 |

## Stack Decision

| 항목 | 결정 | 근거 |
|---|---|---|
| 언어 | TypeScript 5.x (FE·BE 단일) | 단일 언어로 컨텍스트 전환 비용 0. RealWorld 공인 reference 중 다수가 TS. 정적 타입으로 API 형 일치 강제 (R-N-01) |
| 프레임워크 (FE) | React 18 + Vite 5 | RealWorld 공식 가이드 1순위 + SPA + HMR 빠른 dev (F-11 보호 라우트). Bootstrap 4 CSS는 npm `bootstrap@4` import |
| 프레임워크 (BE) | Node.js 20 LTS + Express 4 | 19 엔드포인트 + JWT + ORM 단순 조립. 사양 규모(<100 RPS) 대비 적합 (02 §3) |
| 라우팅 (FE) | React Router 6 | 7 라우트 + 보호 라우트 가드(R-F-17) |
| 상태관리 (FE) | TanStack Query 5 + React Context (auth) | 서버 상태 캐시 + 인증 컨텍스트만. Redux 등 무거운 스토어 불필요 |
| ORM·DB | Prisma 5 + SQLite(dev) / PostgreSQL 16(prod) | 5 엔티티 + unique·cascade 강제(R-N-04). Postman 회귀(R-N-01)는 SQLite로 충분, 운영은 PG |
| 인증 | jsonwebtoken + bcrypt (cost=12) | 사양 충실(JWT, `Authorization: Token <jwt>`, R-N-02). exp=24h |
| 마크다운 | marked 12 + DOMPurify 3 | XSS 방어(R-F-18) — sanitizer 화이트리스트 |
| 테스트 | Vitest 1 (단위·통합) + Playwright 1.43 (E2E) + Newman 6 (Postman 회귀) | 13-test-design §2 정합 (R-N-01) |
| Lint·포맷 | ESLint 9 + Prettier 3 + `@typescript-eslint` | 11-coding-conventions §5 자동 강제 |
| 빌드·dev 진입점 | `./devkit`(루트) + `devtoolkit.config.yaml` `commands.*` | CLAUDE.md ADR-0028 정합. 12-scaffolding §5 참조 |
| 패키지 매니저 | pnpm 9 (workspaces) | FE·BE·E2E 3 패키지 단일 lockfile + 빠른 install |
| HTTP 클라이언트 (FE) | fetch + 얇은 wrapper | 별도 라이브러리 미도입. JWT 헤더 1곳에서 부착 (R-N-02) |
| CORS | `cors@2` 미들웨어, allow-list 화이트리스트 | 04 §4 인터페이스 요구 정합 |
| 컨테이너화 | Docker Compose (dev/prod) — `frontend` + `backend` + `db` | 단일 인스턴스 가정(02 §3), `db`는 dev에서 SQLite 볼륨, prod에서 PG |

## 1. 시스템 컨텍스트

```
                    ┌──────────────────────────────────────────┐
                    │           익명/회원 Web 사용자             │
                    │       (Chrome/Firefox/Safari latest)      │
                    └──────────────────┬───────────────────────┘
                                       │ HTTPS (7 라우트)
                                       ▼
                       ┌───────────────────────────────┐
                       │   FE SPA (React + Vite)        │
                       │   Bootstrap 4 UI               │
                       │   JWT in localStorage          │
                       └──────────────┬────────────────┘
                                      │ HTTPS `/api/*` (19 엔드포인트)
                                      │ Header: `Authorization: Token <jwt>`
                                      ▼
                       ┌───────────────────────────────┐
                       │   BE API (Node + Express)      │
                       │   JWT 검증 · CORS · 라우터     │
                       └──────────────┬────────────────┘
                                      │ Prisma Client (SQL)
                                      ▼
                       ┌───────────────────────────────┐
                       │   RDB (SQLite dev / PG prod)   │
                       │   5 엔티티 + 2 M:N 관계         │
                       └───────────────────────────────┘

  (CI 사이드)
                       ┌───────────────────────────────┐
                       │   Newman → BE API              │  (R-N-01 회귀)
                       └───────────────────────────────┘
                       ┌───────────────────────────────┐
                       │   Playwright → FE (실 BE 대상) │  (E2E 골든패스)
                       └───────────────────────────────┘
```

- **외부 인터페이스 0건** — 결제/OAuth/이미지 업로드 비범위(01 §5, 05 §6).
- **권한 경계**: 익명 / 회원 / 본인 글·댓글 작성자 — 3 단계.
- **신뢰 경계**: 브라우저(untrusted) ↔ BE(trusted, JWT 검증 후 본인 권한 가드).

## 2. 컨테이너 구조

| 컨테이너 | 책임 | 외부 노출 | 의존 |
|---|---|---|---|
| `frontend` | 정적 자산 서빙 (build 산출 `dist/`) — Nginx 1.27 alpine | TCP :80 (dev :5173) | 없음(런타임). dev 시 Vite proxy로 `backend:3000`로 `/api` 전달 |
| `backend`  | Express 앱 + Prisma. JWT 발급/검증·라우터·서비스·리포지토리 | TCP :3000 | `db`, env(`DATABASE_URL`·`JWT_SECRET`) |
| `db`       | SQLite(dev: 파일 볼륨) 또는 PostgreSQL 16(prod) | 컨테이너 네트워크 내부만 | 없음 |

- **배포 단위 2개** — `frontend`·`backend`. `db`는 런타임 종속.
- **스케일 정책(MVP)**: 단일 인스턴스. 수평 확장·CDN·캐시 비범위(02 §3, R-N-05는 dev 측정만).
- **세션 친화도**: stateless(JWT). 수평 확장 시 sticky session 불필요.
- **로컬 dev**: `./devkit dev backend` + `./devkit dev frontend` (또는 docker compose).

## 3. 외부 시스템 / 경계

- **외부 SaaS**: 0건.
- **외부 사양 정본**: `https://realworld-docs.netlify.app/` — 본 시스템의 BE는 이 사양에 100% 적합(R-N-01) + 외부 RealWorld FE 구현체와 상호운용 가능 (05 OQ-P1, 운영 단계 deferral 가능).
- **CI 외부 도구**: Newman(Postman 회귀), Playwright(브라우저 자동화). 둘 다 본 저장소 안에서 실행.
