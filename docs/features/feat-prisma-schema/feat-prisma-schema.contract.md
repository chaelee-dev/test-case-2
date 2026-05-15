---
doc_type: feature-contract
version: v0.1
status: Draft
author: yongtae.cho@bespinglobal.com
date: 2026-05-15
gate: feature
related:
  R-ID: [R-N-05]
  F-ID: []
  supersedes: null
---

# feat-prisma-schema — Change Contract

## 변경 이력

| Version | Date | Author | Change |
|---|---|---|---|
| v0.1 | 2026-05-15 | yongtae.cho@bespinglobal.com | 초안 |

## 0. 참조 정본 ID (Referenced-IDs)

| 종류 | 정본 위치 | 영향 ID |
|---|---|---|
| R-ID (요구) | `docs/planning/04-srs/04-srs.md` | R-N-05 (인덱스·성능). R-N-04 (배포·prod PostgreSQL) |
| F-ID (기능) | `docs/planning/05-prd/05-prd.md` | (none) — 모든 F-* 도메인 모델의 기반 |
| 영향 모듈 | `docs/planning/07-hld/07-hld.md` | M-BE-Repos (선결 — 본 이슈는 Prisma Client만, Repository 구현은 후속) |
| 영향 엔드포인트 | `docs/planning/09-lld-api-spec/09-lld-api-spec.md` | (none) — DB 레이어 |
| 적용 컨벤션 절 | `docs/planning/11-coding-conventions/11-coding-conventions.md` | DB 컬럼 snake_case |

## 1. 변경 의도

5 entity + 2 join table + indexes + 멱등 seed. Prisma Client singleton.

## 2. Before / After

| 항목 | Before | After |
|---|---|---|
| `backend/prisma/schema.prisma` | 없음 | 5 model (User·Article·Tag·Comment + join: ArticleTag·Favorite·Follow). datasource 환경변수. |
| `backend/prisma/seed.ts` | 없음 | upsert로 멱등 seed |
| `backend/src/config/prisma.ts` | 없음 | PrismaClient singleton + graceful disconnect |
| `backend/src/repos/index.ts` | 없음 | barrel placeholder (후속 이슈에서 채움) |
| `backend/src/__tests__/prisma.config.test.ts` | 없음 | PrismaClient singleton 동작 |
| `backend/package.json` | 기존 | + `@prisma/client`, dev: `prisma`. scripts: prisma:migrate / prisma:seed / prisma:generate |
| `backend/.gitignore` | (root에 있음) | (변경 없음) |

## 3. 호출자·의존자 (Call Sites)

| 위치 | 영향 | 조치 |
|---|---|---|
| 후속 ISS-BE-USR-01 (UserService) | `PrismaClient`·`User` 모델 import | 본 이슈 머지 후 자연 import |
| ISS-BE-USR-02·ART-*·CMT-*·etc | 동일 | 후속 이슈 책임 |
| `backend/src/app.ts` | (변경 없음) | Prisma graceful disconnect는 server.ts shutdown signal에서 |

## 4. Backward Compatibility

- Breaking: no — DB 미연결 상태.
- 마이그레이션 필요: 사용자 1회 `pnpm --filter @conduit/backend prisma migrate dev --name init` 실행 후 .db 파일 생성.

## 5. Rollback 전략

- revert 가능: yes — `git revert -m 1 <merge>` 1회. 로컬 `conduit.db` 삭제.
- rollback 절차: revert + `rm backend/conduit.db backend/conduit.db-journal`.
- 데이터 손상 위험: 본 이슈 *직전* 머지된 상태로 돌아가면 DB 데이터 모두 손실. 다만 sprint 1 진행 중이라 사용자 데이터 없음 — 손상 위험 낮음.

## 6. 비목표

- Repository 구현 (UserRepo·ArticleRepo 등) → 후속 서비스 이슈.
- prod PostgreSQL 마이그레이션 실증 → Sprint 3 ISS-DEPLOY-* 또는 별도 운영 작업.
