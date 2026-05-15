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

# feat-fe-auth-pages — Change Contract

## 변경 이력

| Version | Date | Author | Change |
|---|---|---|---|
| v0.1 | 2026-05-15 | yongtae.cho@bespinglobal.com | 초안 |

## 0. 참조 정본 ID (Referenced-IDs)

| 종류 | 정본 위치 | 영향 ID |
|---|---|---|
| R-ID (요구) | `docs/planning/04-srs/04-srs.md` | R-F-01, R-F-02 |
| F-ID (기능) | `docs/planning/05-prd/05-prd.md` | F-01 |
| 영향 모듈 | `docs/planning/07-hld/07-hld.md` | M-FE-Pages, M-FE-Components |
| 영향 엔드포인트 | `docs/planning/09-lld-api-spec/09-lld-api-spec.md` | POST /api/users, POST /api/users/login |
| 적용 컨벤션 절 | `docs/planning/11-coding-conventions/11-coding-conventions.md` | §3 컴포넌트 명명 |

## 1. 변경 의도

가입·로그인 폼 + ErrorList.

## 2. Before / After

| 항목 | Before | After |
|---|---|---|
| pages/LoginPage.tsx | placeholder | email/password 폼 + submit → setAuthUser + /로 navigate |
| pages/RegisterPage.tsx | placeholder | username/email/password 폼 |
| components/ErrorList.tsx | 없음 | parseApiErrors 출력 |
| api/endpoints/users.ts | (기존 register/login) | 변경 없음 |

## 3. 호출자·의존자 (Call Sites)

| 위치 | 영향 | 조치 |
|---|---|---|
| Router /login·/register | 본 컴포넌트 | 본 PR |

## 4. Backward Compatibility

- Breaking: no.

## 5. Rollback 전략

- revert 가능: yes.

## 6. 비목표

(없음)
