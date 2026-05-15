---
doc_type: feature-acceptance
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

# feat-e2e-playwright — Acceptance Criteria

## 변경 이력

| Version | Date | Author | Change |
|---|---|---|---|
| v0.1 | 2026-05-15 | yongtae.cho@bespinglobal.com | 초안 |

## 1. 인수 기준 (Given/When/Then)

### AC-01: auth 골든패스

- Given BE+FE running
- When 사용자 가입 → 로그인
- Then 200 + redirect /
- 측정: 자동 (BE+FE running 시 playwright)
- R-ID: R-N-04

### AC-02: articles 골든패스

- Given seed 글 존재
- When /로 진입 → 글 클릭
- Then ArticlePage 렌더
- 측정: 자동
- R-ID: R-N-04

### AC-03: XSS 차단

- Given 작성자가 body에 `<script>alert(1)</script>` 게시
- When 사용자가 글 조회
- Then alert 실행 안 됨 (DOMPurify)
- 측정: 자동
- R-ID: R-N-04 (RISK-03)

### AC-04: a11y 키보드

- Given Tab 키
- When NavBar 순회
- Then focus가 logo → Home → links 순서
- 측정: 자동
- R-ID: R-N-04

## 2. Definition of Done (D-06)

- [ ] 4 e2e files
- [ ] AI 정적 (E2E는 BE+FE running 의존)
- [ ] Test Plan 4블록
- [ ] tested 라벨 P14
- [ ] Approve 1
- [ ] CI green N/A

## 3. 비기능 인수

- 총 실행 시간 ≤60초.

## 4. 회귀 인수

- 후속 PR이 본 E2E 통과 필요.
