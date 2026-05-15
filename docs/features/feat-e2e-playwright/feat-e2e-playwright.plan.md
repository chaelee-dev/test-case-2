---
doc_type: feature-plan
version: v0.1
status: Draft
author: yongtae.cho@bespinglobal.com
date: 2026-05-15
gate: feature
related:
  R-ID: [R-N-04]
  F-ID: []
  supersedes: null
---

# feat-e2e-playwright — Implementation Plan

## 변경 이력

| Version | Date | Author | Change |
|---|---|---|---|
| v0.1 | 2026-05-15 | yongtae.cho@bespinglobal.com | 초안 |

## 1. 커밋 시퀀스 (DAG)

| # | 커밋 | 영향 파일 | 테스트 추가 | 회귀 위험 |
|---|---|---|---|---|
| 1 | `test(e2e): playwright 핵심 4 골든패스 + XSS + a11y (#26)` | e2e/tests/* | 4 e2e files | 중간 |

## 2. 의존성 그래프

```
#1 단일
```

Blocked-by: 없음. FE/BE 머지 완료.

## 3. 테스트 매핑

| 커밋 | 테스트 추가 위치 | 시나리오 |
|---|---|---|
| #1 | e2e/tests/{auth,articles,markdown-xss,a11y-keyboard}.e2e.ts | 4 시나리오 + XSS payload + Tab 키보드 |

## 4. 빌드·실행 검증 단계

```bash
# BE + FE 띄운 상태
./devkit dev backend &
./devkit dev frontend &
./devkit e2e
```

## 5. 점진 합의 / 결정 발생 항목

- ADR: no.
- 잔여 7 골든패스 — follow-up.
