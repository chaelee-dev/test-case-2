---
doc_type: feature-plan
version: v0.1
status: Draft
author: yongtae.cho@bespinglobal.com
date: 2026-05-15
gate: feature
related:
  R-ID: [R-F-12]
  F-ID: [F-07]
  supersedes: null
---

# feat-articles-favorite — Implementation Plan

## 변경 이력

| Version | Date | Author | Change |
|---|---|---|---|
| v0.1 | 2026-05-15 | yongtae.cho@bespinglobal.com | 초안 |

## 1. 커밋 시퀀스 (DAG)

| # | 커밋 | 영향 파일 | 테스트 추가 | 회귀 위험 |
|---|---|---|---|---|
| 1 | `feat(backend): favorite POST/DELETE (#14)` | articleService·routes·integration | integration 5 | 중간 |

## 2. 의존성 그래프

```
#1 단일
```

Blocked-by: 없음.

## 3. 테스트 매핑

| 커밋 | 테스트 추가 위치 | 시나리오 |
|---|---|---|
| #1 | articles.favorite.integration.test.ts | POST 정상 / DELETE 정상 / 미존재 404 / 401 / 멱등 |

## 4. 빌드·실행 검증 단계

```bash
./devkit test backend
curl -X POST -H "Authorization: Token <jwt>" localhost:3000/api/articles/<slug>/favorite
```

## 5. 점진 합의 / 결정 발생 항목

- ADR: no.
