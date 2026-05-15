---
doc_type: feature-brief
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

# feat-user-register-login — Feature Brief

## 변경 이력

| Version | Date | Author | Change |
|---|---|---|---|
| v0.1 | 2026-05-15 | yongtae.cho@bespinglobal.com | 초안 |

## 1. 한 줄 의도

`POST /api/users` 회원가입 + `POST /api/users/login` 로그인. bcrypt cost=12, JWT 발급.

## 2. 사용자 가치

- RealWorld 사용자가 가입·로그인 가능 → 후속 모든 보호 라우트 활성화의 전제.

## 3. 현재 상태 → 변경 후 상태

| 측면 | 현재 | 변경 후 |
|---|---|---|
| User CRUD | 없음 | userRepo + userService.register/login |
| /api/users | 없음 | router.post 등록 |
| /api/users/login | 없음 | router.post 등록 |
| seed STUB_HASH | 의도된 임시 | 실 bcrypt(cost=12)로 교체 (seed.ts 갱신) |

## 4. 모드 자동 감지 결과

- mode: add
- 근거: ADR-0032 규칙 4 (type:feature)

## 5. 영향 범위

신규: `backend/src/repos/userRepo.ts`, `backend/src/services/userService.ts`, `backend/src/routes/users.ts`, 단위·통합 테스트.
수정: `backend/src/app.ts` (router mount), `backend/prisma/seed.ts` (실 bcrypt), `backend/package.json` (bcrypt dep).

## 6. 비목표

- GET/PUT /api/user → ISS-BE-USR-02.
- 프로필·팔로우·게시글 → 후속 이슈.

## 7. Open Questions

(없음)
