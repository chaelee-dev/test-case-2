---
doc_type: feature-contract
version: v0.1
status: Draft
author: yongtae.cho@bespinglobal.com
date: 2026-05-15
gate: feature
related:
  R-ID: []
  F-ID: [F-11]
  supersedes: null
---

# feat-fe-init — Change Contract

## 변경 이력

| Version | Date | Author | Change |
|---|---|---|---|
| v0.1 | 2026-05-15 | yongtae.cho@bespinglobal.com | 초안 |

## 0. 참조 정본 ID (Referenced-IDs)

| 종류 | 정본 위치 | 영향 ID |
|---|---|---|
| R-ID (요구) | `docs/planning/04-srs/04-srs.md` | (none) — FE 인프라 |
| F-ID (기능) | `docs/planning/05-prd/05-prd.md` | F-11 (FE 보호 라우트) |
| 영향 모듈 | `docs/planning/07-hld/07-hld.md` | M-FE-RouterShell, M-FE-AuthCtx, M-FE-ApiClient |
| 영향 엔드포인트 | `docs/planning/09-lld-api-spec/09-lld-api-spec.md` | (모든 — ApiClient 호출) |
| 적용 컨벤션 절 | `docs/planning/11-coding-conventions/11-coding-conventions.md` | §3 FE 명명, §6 import |

## 1. 변경 의도

FE 라우터·인증·API 클라이언트 기반 구축.

## 2. Before / After

| 항목 | Before | After |
|---|---|---|
| frontend/src/router/routes.tsx | 없음 | createBrowserRouter — 7 라우트 placeholder |
| frontend/src/router/ProtectedRoute.tsx | 없음 | Navigate to /login if !user |
| frontend/src/auth/AuthProvider.tsx | 없음 | localStorage + setUser/clearUser |
| frontend/src/auth/useAuth.ts | 없음 | hook |
| frontend/src/auth/tokenStorage.ts | 없음 | get/set/clear |
| frontend/src/api/apiClient.ts | 없음 | fetch wrapper + Token 헤더 + 401 → clear |
| frontend/src/api/parseErrors.ts | 없음 | RealWorld errors → string[] |
| frontend/src/types/domain.ts | 없음 | User, Profile, Article, Comment 타입 |
| frontend/src/App.tsx | 더미 | <RouterProvider> + <AuthProvider> |
| frontend/package.json | 기존 | + react-router-dom |

## 3. 호출자·의존자 (Call Sites)

| 위치 | 영향 | 조치 |
|---|---|---|
| #19 LoginPage·RegisterPage | useAuth + apiClient | 후속 |
| #20 HomePage | apiClient | 후속 |

## 4. Backward Compatibility

- Breaking: yes — "Conduit boot OK" 더미 제거. 단 sprint 1 산출이라 사용자 영향 0.

## 5. Rollback 전략

- revert 가능: yes.

## 6. 비목표

- 페이지 UI → #19~#24.
