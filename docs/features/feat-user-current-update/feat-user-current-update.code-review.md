---
doc_type: feature-code-review
version: v0.1
status: Draft
author: yongtae.cho@bespinglobal.com
date: 2026-05-15
gate: feature
related:
  R-ID: [R-F-03]
  F-ID: [F-01, F-02]
  supersedes: null
---

# feat-user-current-update — Code Review

## 변경 이력

| Version | Date | Author | Change |
|---|---|---|---|
| v0.1 | 2026-05-15 | yongtae.cho@bespinglobal.com | 초안 |

## 0. Verdict

- verdict: PASS
- reviewer: yongtae.cho@bespinglobal.com
- review_at: 2026-05-15

## 1. 컨트랙트 충실도

§2 6 항목 매핑 OK. 09 §3 GET/PUT /api/user 사양 1:1.

## 2. 테스트 커버리지

8건 추가 (user.integration.test.ts GET 3 + PUT 5).

## 3. 보안 / 시크릿

- requireAuth 강제 — JWT 누락 시 401.
- 화이트리스트 (bio·image·email·username·password) — mass assignment 방어 (F-RISK-01 완화).
- password 빈 문자열 = 미변경.

## 4. 가독성 / 단순성

userService.updateCurrent 50줄 — 분기 명확.

## 5. 발견 사항 (3축 OX 분류)

| 발견 | in_scope | blocks_merge | same_area | 처리 |
|---|---|---|---|---|
| PUT만으로 password 변경 가능 — 현재 비밀번호 재확인 없음 | O | X | O | 사양 미명시. 운영 강화 ADR |
| image URL 검증 없음 | O | X | O | 사양 미명시 |

## 6. NEEDS-WORK 항목

(없음)
