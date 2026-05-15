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

# feat-fe-init — Feature Brief

## 변경 이력

| Version | Date | Author | Change |
|---|---|---|---|
| v0.1 | 2026-05-15 | yongtae.cho@bespinglobal.com | 초안 |

## 1. 한 줄 의도

RouterShell + AuthCtx Provider + ApiClient (Token 헤더 자동 부착).

## 2. 사용자 가치

FE 라우팅·인증·API 호출의 공통 기반.

## 3. 현재 상태 → 변경 후 상태

| 측면 | 현재 | 변경 후 |
|---|---|---|
| Router | "Conduit boot OK" 더미 | react-router-dom + protectedRoute |
| AuthCtx | 없음 | AuthProvider + useAuth |
| ApiClient | 없음 | fetch wrapper + Token 헤더 + 401 핸들링 |

## 4. 모드 자동 감지 결과

- mode: add
- 근거: ADR-0032 규칙 4 (type:feature)

## 5. 영향 범위

신규: frontend/src/router/, frontend/src/auth/, frontend/src/api/, types/domain.ts, 단위 테스트.

## 6. 비목표

- LoginPage·RegisterPage UI → #19.
- HomePage → #20.

## 7. Open Questions

(없음)
