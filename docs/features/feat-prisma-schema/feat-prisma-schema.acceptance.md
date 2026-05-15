---
doc_type: feature-acceptance
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

# feat-prisma-schema — Acceptance Criteria

## 변경 이력

| Version | Date | Author | Change |
|---|---|---|---|
| v0.1 | 2026-05-15 | yongtae.cho@bespinglobal.com | 초안 |

## 1. 인수 기준 (Given/When/Then)

### AC-01: prisma migrate init 성공

- Given `schema.prisma` + `.env`의 `DATABASE_URL=file:./conduit.db`
- When `pnpm prisma:migrate` 실행
- Then 5 테이블 + 2 join 생성 + migration 파일 1개
- 측정 방법: 수동 확인
- R-ID: R-N-05

### AC-02: UNIQUE 제약 동작

- Given seed로 사용자 1명 created (username=conduit_admin)
- When 같은 username의 두 번째 INSERT
- Then UNIQUE 위반 throw
- 측정 방법: 자동 테스트 (후속 ISS-BE-USR-01 통합 테스트)
- R-ID: R-N-05

### AC-03: seed 멱등

- Given seed 1회 실행 완료
- When seed 재실행
- Then 데이터 row count 동일 + UNIQUE 위반 없음 (upsert)
- 측정 방법: 수동 확인
- R-ID: R-N-05

### AC-04: PrismaClient singleton

- Given app 부팅
- When 여러 모듈에서 `getPrisma()` 호출
- Then 동일 PrismaClient 인스턴스 반환
- 측정 방법: 자동 테스트
- R-ID: R-N-05

## 2. Definition of Done (D-06)

- [ ] 단위 테스트: prisma.config.test.ts PASS
- [ ] AI 게이트: 정적 schema validate
- [ ] Test Plan 4블록: PR 본문
- [ ] tested 라벨: 휴먼 게이트 후
- [ ] Approve: 1명
- [ ] CI green: N/A (ISS-CI-01 BLOCKED)

## 3. 비기능 인수

- 마이그레이션 시간 ≤5초 (SQLite 빈 DB).

## 4. 회귀 인수

- 후속 BE 서비스가 PrismaClient import 가능.
