---
doc_type: feature-acceptance
version: v0.1
status: Draft
author: yongtae.cho@bespinglobal.com
date: 2026-05-15
gate: feature
related:
  R-ID: [R-F-09]
  F-ID: [F-05]
  supersedes: null
---

# feat-articles-create — Acceptance Criteria

## 변경 이력

| Version | Date | Author | Change |
|---|---|---|---|
| v0.1 | 2026-05-15 | yongtae.cho@bespinglobal.com | 초안 |

## 1. 인수 기준 (Given/When/Then)

### AC-01: POST 정상 → 200 + article

- Given 인증 + body 유효
- When POST
- Then 200 + article (slug 생성, tagList 반영)
- 측정: 자동
- R-ID: R-F-09

### AC-02: 빈 title → 422

- Given title=""
- When POST
- Then 422 + can't be empty
- 측정: 자동
- R-ID: R-F-09

### AC-03: 401 (인증 없음)

- Given 토큰 없음
- When POST
- Then 401
- 측정: 자동
- R-ID: R-F-09

### AC-04: tagList upsert M:N

- Given tagList=["foo","bar"]
- When POST
- Then ArticleTag 2건 + Tag upsert (기존 있으면 재사용)
- 측정: 자동
- R-ID: R-F-09

### AC-05: 슬러그 충돌 자동 suffix

- Given 같은 title 두 번
- When 두 번째 POST
- Then 두 article 모두 다른 slug (suffix 추가)
- 측정: 자동
- R-ID: R-F-09

## 2. Definition of Done (D-06)

- [ ] 단위 5건 (slug)
- [ ] 통합 5건
- [ ] AI 정적
- [ ] Test Plan 4블록
- [ ] tested 라벨 P14
- [ ] Approve 1
- [ ] CI green N/A

## 3. 비기능 인수

- 응답 ≤200ms.

## 4. 회귀 인수

- GET /api/articles 회귀.
