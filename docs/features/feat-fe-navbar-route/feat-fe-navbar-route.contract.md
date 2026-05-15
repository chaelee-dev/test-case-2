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

# feat-fe-navbar-route — Change Contract

## 변경 이력

| Version | Date | Author | Change |
|---|---|---|---|
| v0.1 | 2026-05-15 | yongtae.cho@bespinglobal.com | 초안 |

## 0. 참조 정본 ID (Referenced-IDs)

| 종류 | 정본 위치 | 영향 ID |
|---|---|---|
| R-ID (요구) | `docs/planning/04-srs/04-srs.md` | (none) |
| F-ID (기능) | `docs/planning/05-prd/05-prd.md` | F-11 |
| 영향 모듈 | `docs/planning/07-hld/07-hld.md` | M-FE-RouterShell, M-FE-Components |
| 영향 엔드포인트 | `docs/planning/09-lld-api-spec/09-lld-api-spec.md` | (none) |
| 적용 컨벤션 절 | `docs/planning/11-coding-conventions/11-coding-conventions.md` | §3 |

## 1. 변경 의도

NavBar + Footer + Outlet 레이아웃.

## 2. Before / After

| 항목 | Before | After |
|---|---|---|
| components/NavBar.tsx | 없음 | 인증 분기 |
| components/Footer.tsx | 없음 | 신규 |
| router/RootLayout.tsx | 없음 | <NavBar /> + <Outlet /> + <Footer /> |
| router/routes.tsx | 9 라우트 (flat) | element: RootLayout + children |

## 3. 호출자·의존자 (Call Sites)

| 위치 | 영향 | 조치 |
|---|---|---|
| App.tsx | RouterProvider | 변경 없음 |

## 4. Backward Compatibility

- Breaking: no.

## 5. Rollback 전략

- revert 가능: yes.

## 6. 비목표

(없음)
