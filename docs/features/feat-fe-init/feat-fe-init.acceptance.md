---
doc_type: feature-acceptance
version: v0.1
status: Draft
author: yongtae.cho@bespinglobal.com
date: 2026-05-15
gate: feature
related:
  R-ID: [R-N-04]
  F-ID: [F-11]
  supersedes: null
---

# feat-fe-init — Acceptance Criteria

## 변경 이력

| Version | Date | Author | Change |
|---|---|---|---|
| v0.1 | 2026-05-15 | yongtae.cho@bespinglobal.com | 초안 |

## 1. 인수 기준 (Given/When/Then)

### AC-01: /login 방문 → 빈 라우트 렌더

- Given Vite dev
- When 사용자가 /login 방문
- Then placeholder 페이지 렌더 (실제 UI는 #19)
- 측정: 수동 P14
- R-ID: R-N-04

### AC-02: ProtectedRoute 인증 없으면 /login redirect

- Given user=null + /editor 방문
- When 라우터 evaluate
- Then /login로 navigate
- 측정: 자동
- R-ID: R-N-04

### AC-03: ApiClient Token 헤더

- Given user.token 저장됨
- When apiClient.get('/api/user')
- Then Authorization: Token <jwt> 헤더 포함
- 측정: 자동
- R-ID: R-N-04

### AC-04: 401 응답 → token clear + redirect

- Given user.token (만료)
- When apiClient → 401
- Then localStorage clear + window.location → /login
- 측정: 자동
- R-ID: R-N-04

## 2. Definition of Done (D-06)

- [ ] 단위 9건 (auth 4 + apiClient 5)
- [ ] AI 정적
- [ ] Test Plan 4블록
- [ ] tested 라벨 P14
- [ ] Approve 1
- [ ] CI green N/A

## 3. 비기능 인수

- TTI ≤2s (개발).

## 4. 회귀 인수

- /health (BE) 회귀.
