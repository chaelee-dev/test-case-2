---
doc_type: feature-plan
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

# feat-prisma-schema — Implementation Plan

## 변경 이력

| Version | Date | Author | Change |
|---|---|---|---|
| v0.1 | 2026-05-15 | yongtae.cho@bespinglobal.com | 초안 |

## 1. 커밋 시퀀스 (DAG)

| # | 커밋 | 영향 파일 | 테스트 추가 | 회귀 위험 |
|---|---|---|---|---|
| 1 | `feat(backend): Prisma schema 5 entity + 2 join (#5)` | `backend/prisma/schema.prisma`, `backend/package.json` deps/scripts | (정적 — schema parse) | 낮음 |
| 2 | `feat(backend): Prisma Client singleton + repos barrel (#5)` | `backend/src/config/prisma.ts`, `backend/src/repos/index.ts`, 단위 테스트 | `prisma.config.test.ts` | 낮음 |
| 3 | `feat(backend): seed.ts 멱등 초기화 (#5)` | `backend/prisma/seed.ts` | (사용자 실행 — `prisma db seed`) | 낮음 |

## 2. 의존성 그래프

```
#1 (schema)
  ├──▶ #2 (Client singleton — schema 의존)
  └──▶ #3 (seed — schema 모델 의존)
```

Blocked-by: 없음. ISS-BE-INIT-01 완료 + DATABASE_URL env 준비.

## 3. 테스트 매핑

| 커밋 | 테스트 추가 위치 | 시나리오 |
|---|---|---|
| #1 | (정적) | `prisma format`·`prisma validate` 사용자 환경 |
| #2 | `prisma.config.test.ts` | PrismaClient 호출이 동일 인스턴스 반환 + disconnect |
| #3 | (휴먼 게이트) | `prisma db seed` 멱등 — 2회 실행해도 데이터 변경 없음 |

## 4. 빌드·실행 검증 단계

```bash
# 동적 (P14)
pnpm install
cd backend
pnpm prisma:generate      # Client 생성
pnpm prisma:migrate       # SQLite 마이그레이션
pnpm prisma:seed          # 멱등 seed
pnpm prisma:seed          # 재실행 — 변경 없음

# 단위
pnpm test                 # prisma.config.test.ts 포함 vitest run
```

## 5. 점진 합의 / 결정 발생 항목

- ADR 작성 필요: no — 04 §5 결정 적용.
- 결정 변경 잠재 항목: Prisma → Drizzle/Kysely 전환 시 ADR 필수.
