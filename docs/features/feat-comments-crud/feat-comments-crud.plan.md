---
doc_type: feature-plan
version: v0.1
status: Draft
author: yongtae.cho@bespinglobal.com
date: 2026-05-15
gate: feature
related:
  R-ID: [R-F-13, R-F-14, R-F-15]
  F-ID: [F-09]
  supersedes: null
---

# feat-comments-crud — Implementation Plan

## 변경 이력

| Version | Date | Author | Change |
|---|---|---|---|
| v0.1 | 2026-05-15 | yongtae.cho@bespinglobal.com | 초안 |

## 1. 커밋 시퀀스 (DAG)

| # | 커밋 | 영향 파일 | 테스트 추가 | 회귀 위험 |
|---|---|---|---|---|
| 1 | `feat(backend): Comments CRUD — repo/service/routes (#15)` | commentRepo·commentService·routes/comments·app·integration | integration 8 | 중간 |

## 2. 의존성 그래프

```
#1 단일
```

Blocked-by: 없음.

## 3. 테스트 매핑

| 커밋 | 테스트 추가 위치 | 시나리오 |
|---|---|---|
| #1 | comments.integration.test.ts | GET 빈 / GET with comments / POST 정상 / POST 401 / POST 404 / POST 422 / DELETE 정상 / DELETE 403 / DELETE 404 / 글 작성자도 삭제 가능 |

## 4. 빌드·실행 검증 단계

```bash
./devkit test backend
curl localhost:3000/api/articles/<slug>/comments
curl -X POST -H "Authorization: Token <jwt>" -H "Content-Type: application/json" -d '{"comment":{"body":"hi"}}' localhost:3000/api/articles/<slug>/comments
```

## 5. 점진 합의 / 결정 발생 항목

- ADR: no.
- 결정: DELETE 권한은 작성자 OR 글 작성자 (사양 명시 없음 — Conduit 관행).
