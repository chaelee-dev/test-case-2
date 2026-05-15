---
doc_type: feature-code-review
version: v0.1
status: Draft
author: yongtae.cho@bespinglobal.com
date: 2026-05-15
gate: feature
related:
  R-ID: [R-F-01, R-F-02]
  F-ID: [F-01]
  supersedes: null
---

# feat-user-register-login — Code Review

## 변경 이력

| Version | Date | Author | Change |
|---|---|---|---|
| v0.1 | 2026-05-15 | yongtae.cho@bespinglobal.com | 초안 |

## 0. Verdict

- verdict: PASS
- reviewer: yongtae.cho@bespinglobal.com
- review_at: 2026-05-15

## 1. 컨트랙트 충실도

§2 8 항목 매핑 OK. 09 §3 응답 형식 1:1 (user 래퍼·token·image null).

## 2. 테스트 커버리지

16건 — userService 8 (register 5 + login 3) + integration 8 (POST 5 + login 3). BE services 90% 목표 달성 예상.

## 3. 보안 / 시크릿

- bcrypt cost = env.BCRYPT_COST (12 prod). 본 hash 검증으로 평문 비교 없음.
- DUMMY_HASH로 timing oracle 회피 — login에서 미가입 email/잘못된 password 응답 시간 유사.
- requestLogger는 method+url만 — body password 로깅 0 (F-RISK-01 완화).
- password validation 8자 이상.

## 4. 가독성 / 단순성

- userService 90줄 — register/login 직선.
- routes 50줄 — body parse + service 호출.
- pickUserBody 헬퍼로 unknown body 안전 파싱.

## 5. 발견 사항 (3축 OX 분류)

| 발견 | in_scope | blocks_merge | same_area | 처리 |
|---|---|---|---|---|
| DUMMY_HASH 상수는 bcrypt 형식 — 실 시크릿 아님 | O | X | O | 의도 — timing oracle 회피, 보안상 안전 |
| password validation은 길이만 (강도 검사 없음) | O | X | O | 사양에 명시 없음. 후속 운영 시 ADR |
| EMAIL_RE 단순 — 완전한 RFC 5322 미준수 | O | X | O | 운영 검증 충분. 사양 명시 없음 |

## 6. NEEDS-WORK 항목

(없음)
