---
doc_type: feature-contract
version: v0.1
status: Draft
author: yongtae.cho@bespinglobal.com
date: 2026-05-15
gate: feature
related:
  R-ID: [R-F-01, R-F-02]
  F-ID: [F-01]
  supersedes: null
---

# feat-user-register-login — Change Contract

## 변경 이력

| Version | Date | Author | Change |
|---|---|---|---|
| v0.1 | 2026-05-15 | yongtae.cho@bespinglobal.com | 초안 |

## 0. 참조 정본 ID (Referenced-IDs)

| 종류 | 정본 위치 | 영향 ID |
|---|---|---|
| R-ID (요구) | `docs/planning/04-srs/04-srs.md` | R-F-01 (가입), R-F-02 (로그인) |
| F-ID (기능) | `docs/planning/05-prd/05-prd.md` | F-01 (인증 / 사용자 계정) |
| 영향 모듈 | `docs/planning/07-hld/07-hld.md` | M-BE-UserService, M-BE-Repos, M-BE-Routers, M-BE-JwtService |
| 영향 엔드포인트 | `docs/planning/09-lld-api-spec/09-lld-api-spec.md` | POST /api/users, POST /api/users/login |
| 적용 컨벤션 절 | `docs/planning/11-coding-conventions/11-coding-conventions.md` | §2 에러 422 / ConflictError |

## 1. 변경 의도

가입·로그인 2 엔드포인트 구현. bcrypt cost=12 (R-N-02). 응답 형식 사양 1:1.

## 2. Before / After

| 항목 | Before | After |
|---|---|---|
| `backend/src/repos/userRepo.ts` | 없음 | findByUsername·findByEmail·create·toAuth (passwordHash 제외 직렬화) |
| `backend/src/services/userService.ts` | 없음 | register / login + bcrypt + JWT |
| `backend/src/routes/users.ts` | 없음 | router.post('/', register) + router.post('/login', login) |
| `backend/src/app.ts` | (변경) | `app.use('/api/users', usersRouter)` 마운트 |
| `backend/prisma/seed.ts` | STUB_HASH | 실 bcrypt cost=12 해시 (sync 함수 사용) |
| `backend/package.json` deps | 기존 | + bcrypt + @types/bcrypt |
| 단위 테스트 `userService.test.ts` | 없음 | register/login, 중복, 잘못된 비밀번호 |
| 통합 테스트 `users.integration.test.ts` | 없음 | POST 정상·중복·형식 위반·로그인 정상·실패 |

## 3. 호출자·의존자 (Call Sites)

| 위치 | 영향 | 조치 |
|---|---|---|
| ISS-BE-USR-02 (GET/PUT /api/user) | userService 본 산출 사용 | 후속 이슈 |
| FE LoginPage·RegisterPage | 본 엔드포인트 사용 | Sprint 3 |
| seed.ts | passwordHash 실 bcrypt | 본 이슈 동일 PR에서 갱신 |

## 4. Backward Compatibility

- Breaking: no — 신규 엔드포인트.
- 마이그레이션 필요: 사용자가 `prisma migrate dev` 이미 수행 + seed 재실행.

## 5. Rollback 전략

- revert 가능: yes — 단순 revert.
- 데이터 손상 위험: 본 PR 머지 후 가입된 사용자 데이터는 revert 시 손실. sprint 1 초기라 사용자 데이터 0.

## 6. 비목표

- /api/user (GET/PUT) → ISS-BE-USR-02.
- 프로필·팔로우·게시글 → 후속 sprint.
