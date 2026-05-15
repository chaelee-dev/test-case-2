---
doc_type: feature-acceptance
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

# feat-fe-auth-pages — Acceptance Criteria

## 변경 이력

| Version | Date | Author | Change |
|---|---|---|---|
| v0.1 | 2026-05-15 | yongtae.cho@bespinglobal.com | 초안 |

## 1. 인수 기준 (Given/When/Then)

### AC-01: LoginPage 정상 → 인증 + redirect

- Given valid email/password
- When submit
- Then setAuthUser + navigate /
- 측정: 자동 (RTL)
- R-ID: R-F-02

### AC-02: LoginPage 실패 → ErrorList

- Given API 422 응답
- When submit
- Then ErrorList에 메시지 표시
- 측정: 자동
- R-ID: R-F-02

### AC-03: RegisterPage 정상

- Given username/email/password
- When submit
- Then setAuthUser + navigate /
- 측정: 자동
- R-ID: R-F-01

## 2. Definition of Done (D-06)

- [ ] 단위 5건
- [ ] AI 정적 (UI placeholder는 P14)
- [ ] Test Plan 4블록
- [ ] tested 라벨 P14
- [ ] Approve 1
- [ ] CI green N/A

## 3. 비기능 인수

- TTI ≤2s.

## 4. 회귀 인수

- ProtectedRoute redirect 회귀.
