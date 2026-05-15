---
doc_type: feature-plan
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

# feat-fe-init — Implementation Plan

## 변경 이력

| Version | Date | Author | Change |
|---|---|---|---|
| v0.1 | 2026-05-15 | yongtae.cho@bespinglobal.com | 초안 |

## 1. 커밋 시퀀스 (DAG)

| # | 커밋 | 영향 파일 | 테스트 추가 | 회귀 위험 |
|---|---|---|---|---|
| 1 | `feat(frontend): types + tokenStorage + AuthProvider (#18)` | types/domain·auth/* | unit 4 | 낮음 |
| 2 | `feat(frontend): apiClient + parseErrors (#18)` | api/*·msw 단위 | unit 5 | 중간 |
| 3 | `feat(frontend): RouterShell + ProtectedRoute + App.tsx (#18)` | router/*·App·main, frontend/package.json | (React Testing Library) | 중간 |

## 2. 의존성 그래프

```
#1 → #2 → #3
```

Blocked-by: 없음.

## 3. 테스트 매핑

| 커밋 | 테스트 추가 위치 | 시나리오 |
|---|---|---|
| #1 | auth.test.ts | tokenStorage get/set/clear + AuthProvider state |
| #2 | apiClient.test.ts | Token 헤더 부착 / 401 → clear / parseErrors |
| #3 | router.test.tsx | ProtectedRoute redirect / placeholder route render |

## 4. 빌드·실행 검증 단계

```bash
./devkit test frontend
./devkit dev frontend &
curl http://localhost:5173/login | grep -q "<!doctype"
```

## 5. 점진 합의 / 결정 발생 항목

- ADR: no.
