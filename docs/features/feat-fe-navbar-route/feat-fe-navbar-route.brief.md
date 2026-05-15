---
doc_type: feature-brief
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

# feat-fe-navbar-route — Feature Brief

## 변경 이력

| Version | Date | Author | Change |
|---|---|---|---|
| v0.1 | 2026-05-15 | yongtae.cho@bespinglobal.com | 초안 |

## 1. 한 줄 의도

NavBar + Footer + 404 보강. protectedRoute returnUrl은 이미 #18에 도입됨.

## 2. 사용자 가치

전역 네비 + 인증 분기.

## 3. 현재 상태 → 변경 후 상태

| 측면 | 현재 | 변경 후 |
|---|---|---|
| NavBar | 없음 | Home/SignIn/SignUp/NewArticle/Settings/Profile |
| Footer | 없음 | 단순 footer |
| 404 | NotFoundPage 기본 | (변경 없음) |
| Layout | 없음 | <Outlet /> 기반 |

## 4. 모드 자동 감지 결과

- mode: add
- 근거: ADR-0032 규칙 4 (type:feature)

## 5. 영향 범위

신규: NavBar·Footer, RootLayout, routes 재구성.

## 6. 비목표

(없음)

## 7. Open Questions

(없음)
