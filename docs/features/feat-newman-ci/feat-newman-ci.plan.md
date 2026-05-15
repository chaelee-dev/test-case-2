---
doc_type: feature-plan
version: v0.1
status: Draft
author: yongtae.cho@bespinglobal.com
date: 2026-05-15
gate: feature
related:
  R-ID: [R-N-01]
  F-ID: []
  supersedes: null
---

# feat-newman-ci — Implementation Plan

## 변경 이력

| Version | Date | Author | Change |
|---|---|---|---|
| v0.1 | 2026-05-15 | yongtae.cho@bespinglobal.com | 초안 |

## 1. 커밋 시퀀스 (DAG)

| # | 커밋 | 영향 파일 | 테스트 추가 | 회귀 위험 |
|---|---|---|---|---|
| 1 | `chore(infra): Postman 컬렉션 placeholder + newman runner (#17)` | e2e/newman/* + e2e/package.json | (newman 자체) | 낮음 |

## 2. 의존성 그래프

```
#1 단일
```

Blocked-by: 없음.

## 3. 테스트 매핑

| 커밋 | 테스트 추가 위치 | 시나리오 |
|---|---|---|
| #1 | (newman 자체가 테스트 도구) | placeholder 1 케이스 |

## 4. 빌드·실행 검증 단계

```bash
# BE 띄운 상태에서
./devkit dev backend &
pnpm --filter @conduit/e2e test:newman
```

## 5. 점진 합의 / 결정 발생 항목

- ADR: no.
- 후속: 23 케이스 전수 + CI 통합 (별도 이슈)
