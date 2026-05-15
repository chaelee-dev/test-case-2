---
doc_type: feature-acceptance
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

# feat-articles-update-delete — Acceptance Criteria

## 변경 이력

| Version | Date | Author | Change |
|---|---|---|---|
| v0.1 | 2026-05-15 | yongtae.cho@bespinglobal.com | 초안 |

## 1. 인수 기준 (Given/When/Then)

### AC-01: PUT description 정상

- Given 본인 article + body {article:{description:"new"}}
- When PUT
- Then 200 + article.description="new"
- 측정: 자동
- R-ID: R-F-10

### AC-02: PUT title 변경 → slug 재생성

- Given 본인 article + body {article:{title:"New Title"}}
- When PUT
- Then 200 + article.slug=새 slug
- 측정: 자동
- R-ID: R-F-10

### AC-03: 타인 글 PUT → 403

- Given 다른 작성자
- When PUT
- Then 403 forbidden
- 측정: 자동
- R-ID: R-F-10

### AC-04: PUT 404

- Given 미존재 slug
- When PUT
- Then 404
- 측정: 자동
- R-ID: R-F-10

### AC-05: DELETE 정상

- Given 본인 article
- When DELETE
- Then 200 + body `{}` + cascade
- 측정: 자동
- R-ID: R-F-11

### AC-06: 타인 글 DELETE → 403

- Given 다른 작성자
- When DELETE
- Then 403
- 측정: 자동
- R-ID: R-F-11

### AC-07: DELETE 404

- Given 미존재 slug
- When DELETE
- Then 404
- 측정: 자동
- R-ID: R-F-11

## 2. Definition of Done (D-06)

- [ ] 통합 8건
- [ ] AI 정적
- [ ] Test Plan 4블록
- [ ] tested 라벨 P14
- [ ] Approve 1
- [ ] CI green N/A

## 3. 비기능 인수

- DELETE 응답 ≤200ms (cascade).

## 4. 회귀 인수

- GET/POST 회귀.
