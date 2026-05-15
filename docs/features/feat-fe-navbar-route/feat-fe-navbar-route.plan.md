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

# feat-fe-navbar-route — Implementation Plan

## 변경 이력

| Version | Date | Author | Change |
|---|---|---|---|
| v0.1 | 2026-05-15 | yongtae.cho@bespinglobal.com | 초안 |

## 1. 커밋 시퀀스 (DAG)

| # | 커밋 | 영향 파일 | 테스트 추가 | 회귀 위험 |
|---|---|---|---|---|
| 1 | `feat(frontend): NavBar + Footer + RootLayout (#25)` | components·router | unit 2 | 중간 |

## 2. 의존성 그래프

```
#1 단일
```

Blocked-by: 없음.

## 3. 테스트 매핑

| 커밋 | 테스트 추가 위치 | 시나리오 |
|---|---|---|
| #1 | NavBar.test.tsx | 익명 메뉴 + 인증 메뉴 |

## 4. 빌드·실행 검증 단계

```bash
./devkit test frontend
```

## 5. 점진 합의 / 결정 발생 항목

- ADR: no.
