---
doc_type: feature-brief
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

# feat-prisma-schema — Feature Brief

## 변경 이력

| Version | Date | Author | Change |
|---|---|---|---|
| v0.1 | 2026-05-15 | yongtae.cho@bespinglobal.com | 초안 |

## 1. 한 줄 의도

Prisma schema (5 엔티티 + 2 M:N) + 초기 마이그레이션 + 멱등 seed 도입. SQLite(dev)·PostgreSQL(prod) 양방 호환.

## 2. 사용자 가치

- 후속 BE 서비스 이슈가 type-safe Prisma Client로 DB 접근.
- 4 API 테스트가 일관된 seed 데이터로 시작 가능.

## 3. 현재 상태 → 변경 후 상태

| 측면 | 현재 | 변경 후 |
|---|---|---|
| ORM | 없음 | Prisma 5 + Client |
| Schema | 없음 | 5 model + 2 join + indexes |
| seed | 없음 | seed.ts (user 2 + article 3 + tag 5) |

## 4. 모드 자동 감지 결과

- mode: add
- 근거: ADR-0032 규칙 4 (type:feature)

## 5. 영향 범위

신규: `backend/prisma/schema.prisma`, `backend/prisma/seed.ts`, `backend/src/config/prisma.ts`, `backend/src/repos/` 디렉토리(barrel만), 단위 테스트.
수정: `backend/package.json` (prisma deps + scripts).

## 6. 비목표

- Repository 패턴 구현 (UserRepo/ArticleRepo 등)은 후속 서비스 이슈.
- 마이그레이션 실제 실행은 휴먼 게이트.

## 7. Open Questions

- OQ-01 (slug 정책): brief O-01에서 ‘재생성 + 이전 slug 무효’ — 본 schema에서 UNIQUE 제약만, 정책 강제는 서비스 레이어.
