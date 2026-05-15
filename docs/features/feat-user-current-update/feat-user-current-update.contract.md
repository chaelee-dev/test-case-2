---
doc_type: feature-contract
version: v0.1
status: Draft
author: yongtae.cho@bespinglobal.com
date: 2026-05-15
gate: feature
related:
  R-ID: [R-F-03]
  F-ID: [F-01, F-02]
  supersedes: null
---

# feat-user-current-update — Change Contract

## 변경 이력

| Version | Date | Author | Change |
|---|---|---|---|
| v0.1 | 2026-05-15 | yongtae.cho@bespinglobal.com | 초안 |

## 0. 참조 정본 ID (Referenced-IDs)

| 종류 | 정본 위치 | 영향 ID |
|---|---|---|
| R-ID (요구) | `docs/planning/04-srs/04-srs.md` | R-F-03 (현재 사용자 조회·갱신) |
| F-ID (기능) | `docs/planning/05-prd/05-prd.md` | F-01, F-02 |
| 영향 모듈 | `docs/planning/07-hld/07-hld.md` | M-BE-UserService, M-BE-Routers, M-BE-AuthMiddleware |
| 영향 엔드포인트 | `docs/planning/09-lld-api-spec/09-lld-api-spec.md` | GET /api/user, PUT /api/user |
| 적용 컨벤션 절 | `docs/planning/11-coding-conventions/11-coding-conventions.md` | §2 ValidationError·ConflictError |

## 1. 변경 의도

`req.user.id`로 현재 사용자 조회 + 화이트리스트 필드 갱신. password 비움 시 미변경.

## 2. Before / After

| 항목 | Before | After |
|---|---|---|
| `userRepo.update` | 없음 | upsert-style update (whitelist patch) |
| `userService.getCurrent(userId)` | 없음 | AuthUserResponse 반환 (새 token) |
| `userService.update(userId, patch)` | 없음 | bio/image/email/username/password 부분 갱신 + 중복 검증 |
| `routes/users.ts` | POST 2 | + GET /user + PUT /user (requireAuth) |
| `__tests__/userService.test.ts` | 8건 | + getCurrent/update 케이스 추가 |
| `__tests__/users.integration.test.ts` | 8건 | + GET/PUT 케이스 |

## 3. 호출자·의존자 (Call Sites)

| 위치 | 영향 | 조치 |
|---|---|---|
| FE Settings page | PUT /api/user | Sprint 3 |
| FE NavBar | GET /api/user | Sprint 3 |

## 4. Backward Compatibility

- Breaking: no.
- 마이그레이션 필요: no.

## 5. Rollback 전략

- revert 가능: yes — 단순 revert.
- 데이터 손상 위험: 사용자가 PUT으로 갱신한 데이터는 revert 시 코드만 원복, DB는 그대로.

## 6. 비목표

- 사용자 삭제 → RealWorld 사양 없음.
- 비밀번호 강도 검사 → 추후 운영 ADR.
