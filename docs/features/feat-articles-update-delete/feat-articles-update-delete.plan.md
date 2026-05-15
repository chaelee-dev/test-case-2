---
doc_type: feature-plan
version: v0.1
status: Draft
author: yongtae.cho@bespinglobal.com
date: 2026-05-15
gate: feature
related:
  R-ID: [R-F-10, R-F-11]
  F-ID: [F-05]
  supersedes: null
---

# feat-articles-update-delete — Implementation Plan

## 변경 이력

| Version | Date | Author | Change |
|---|---|---|---|
| v0.1 | 2026-05-15 | yongtae.cho@bespinglobal.com | 초안 |

## 1. 커밋 시퀀스 (DAG)

| # | 커밋 | 영향 파일 | 테스트 추가 | 회귀 위험 |
|---|---|---|---|---|
| 1 | `feat(backend): articleService.update/remove + PUT·DELETE 라우트 (#12)` | repo·service·route·integration | integration 8 | 중간 |

## 2. 의존성 그래프

```
#1 단일 커밋
```

Blocked-by: 없음.

## 3. 테스트 매핑

| 커밋 | 테스트 추가 위치 | 시나리오 |
|---|---|---|
| #1 | articles.update-delete.integration.test.ts | PUT 정상 description / PUT title → slug 재생성 / PUT 403 타인 / PUT 404 / PUT 422 empty patch / DELETE 정상 / DELETE 403 / DELETE 404 |

## 4. 빌드·실행 검증 단계

```bash
./devkit test backend
curl -X PUT -H "Authorization: Token <jwt>" -H "Content-Type: application/json" -d '{"article":{"description":"new"}}' localhost:3000/api/articles/<slug>
curl -X DELETE -H "Authorization: Token <jwt>" localhost:3000/api/articles/<slug>
```

## 5. 점진 합의 / 결정 발생 항목

- ADR: no.
- OQ-01 적용: 이전 slug 무효.
