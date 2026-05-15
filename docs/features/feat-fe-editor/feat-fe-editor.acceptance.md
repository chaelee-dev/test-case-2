---
doc_type: feature-acceptance
version: v0.1
status: Draft
author: yongtae.cho@bespinglobal.com
date: 2026-05-15
gate: feature
related:
  R-ID: [R-F-09, R-F-10, R-F-11]
  F-ID: [F-05]
  supersedes: null
---

# feat-fe-editor — Acceptance Criteria

## 변경 이력

| Version | Date | Author | Change |
|---|---|---|---|
| v0.1 | 2026-05-15 | yongtae.cho@bespinglobal.com | 초안 |

## 1. 인수 기준 (Given/When/Then)

### AC-01: 새 글 작성

- Given /editor + 인증
- When 폼 작성 + submit
- Then POST /api/articles → /article/:slug
- 측정: 자동 RTL
- R-ID: R-F-09

### AC-02: edit 모드 prefill

- Given /editor/:slug + 본인 article
- When 페이지 진입
- Then 폼이 기존 값으로 채워짐
- 측정: 자동
- R-ID: R-F-10

### AC-03: edit 후 슬러그 변경 redirect

- Given title 변경 submit
- When PUT 응답에 새 slug
- Then navigate to /article/<new-slug>
- 측정: 자동
- R-ID: R-F-10

### AC-04: ArticlePage 작성자만 delete 버튼

- Given 본인 article 페이지
- When 페이지 진입
- Then Edit·Delete 버튼 표시
- 측정: 자동
- R-ID: R-F-11

### AC-05: delete confirm + /로 redirect

- Given delete 클릭
- When confirm OK
- Then DELETE + navigate /
- 측정: 자동
- R-ID: R-F-11

## 2. Definition of Done (D-06)

- [ ] 단위 2건
- [ ] AI 정적
- [ ] Test Plan 4블록
- [ ] tested 라벨 P14
- [ ] Approve 1
- [ ] CI green N/A

## 3. 비기능 인수

- 응답 ≤300ms.

## 4. 회귀 인수

- HomePage / ArticlePage 회귀.
