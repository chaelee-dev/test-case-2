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

# feat-fe-comments — Acceptance Criteria

## 변경 이력

| Version | Date | Author | Change |
|---|---|---|---|
| v0.1 | 2026-05-15 | yongtae.cho@bespinglobal.com | 초안 |

## 1. 인수 기준 (Given/When/Then)

### AC-01: 댓글 목록 표시

- Given /article/:slug
- When 진입
- Then 댓글 N건 표시
- 측정: 자동
- R-ID: R-F-13

### AC-02: POST 댓글

- Given 인증 + body
- When submit
- Then 새 댓글 추가
- 측정: 자동
- R-ID: R-F-14

### AC-03: 작성자 본인 → delete 버튼

- Given 본인 댓글
- When 페이지 진입
- Then delete 버튼 노출
- 측정: 자동
- R-ID: R-F-15

### AC-04: 글 작성자 → 모든 댓글 delete

- Given 글 작성자
- When 페이지
- Then 모든 댓글에 delete 버튼
- 측정: 자동
- R-ID: R-F-15

## 2. Definition of Done (D-06)

- [ ] 단위 2건
- [ ] AI 정적
- [ ] Test Plan 4블록
- [ ] tested 라벨 P14
- [ ] Approve 1
- [ ] CI green N/A

## 3. 비기능 인수

- 응답 ≤200ms.

## 4. 회귀 인수

- ArticlePage 회귀.
