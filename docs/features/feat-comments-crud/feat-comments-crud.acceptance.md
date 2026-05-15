---
doc_type: feature-acceptance
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

# feat-comments-crud — Acceptance Criteria

## 변경 이력

| Version | Date | Author | Change |
|---|---|---|---|
| v0.1 | 2026-05-15 | yongtae.cho@bespinglobal.com | 초안 |

## 1. 인수 기준 (Given/When/Then)

### AC-01: GET 빈 목록 → 200

- Given article 댓글 0건
- When GET
- Then 200 + `{comments:[]}`
- 측정: 자동
- R-ID: R-F-13

### AC-02: GET 댓글 N건

- Given 댓글 3건
- When GET
- Then 200 + `{comments:[3건]}` (각 comment에 author 포함)
- 측정: 자동
- R-ID: R-F-13

### AC-03: POST 정상 → 200

- Given 인증 + body `{comment:{body:"hi"}}`
- When POST
- Then 200 + comment
- 측정: 자동
- R-ID: R-F-14

### AC-04: POST 빈 body → 422

- Given body `{comment:{body:""}}`
- When POST
- Then 422 + can't be empty
- 측정: 자동
- R-ID: R-F-14

### AC-05: POST 미존재 slug → 404

- Given 미존재 slug
- When POST
- Then 404 article not found
- 측정: 자동
- R-ID: R-F-14

### AC-06: POST 401

- Given 토큰 없음
- When POST
- Then 401
- 측정: 자동
- R-ID: R-F-14

### AC-07: DELETE 본인 댓글 → 200

- Given 본인 작성 댓글
- When DELETE
- Then 200 + `{}`
- 측정: 자동
- R-ID: R-F-15

### AC-08: DELETE 글 작성자 권한 → 200

- Given 본 글의 article 작성자이지만 댓글은 타인
- When DELETE
- Then 200 (글 작성자도 삭제 가능)
- 측정: 자동
- R-ID: R-F-15

### AC-09: DELETE 타인 댓글 (글 작성자 아님) → 403

- Given 타인 댓글, 글 작성자도 아님
- When DELETE
- Then 403
- 측정: 자동
- R-ID: R-F-15

## 2. Definition of Done (D-06)

- [ ] 통합 9건
- [ ] AI 정적
- [ ] Test Plan 4블록
- [ ] tested 라벨 P14
- [ ] Approve 1
- [ ] CI green N/A

## 3. 비기능 인수

- GET 응답 ≤200ms.

## 4. 회귀 인수

- GET/POST /api/articles 회귀.
