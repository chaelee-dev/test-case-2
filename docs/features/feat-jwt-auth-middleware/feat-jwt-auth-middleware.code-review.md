---
doc_type: feature-code-review
version: v0.1
status: Draft
author: yongtae.cho@bespinglobal.com
date: 2026-05-15
gate: feature
related:
  R-ID: [R-N-02]
  F-ID: []
  supersedes: null
---

# feat-jwt-auth-middleware — Code Review

## 변경 이력

| Version | Date | Author | Change |
|---|---|---|---|
| v0.1 | 2026-05-15 | yongtae.cho@bespinglobal.com | 초안 |

## 0. Verdict

- verdict: PASS
- reviewer: yongtae.cho@bespinglobal.com
- review_at: 2026-05-15

## 1. 컨트랙트 충실도

contract §2 6 항목 매핑 OK. RealWorld 사양의 Token prefix 강제. UnauthorizedError 401 응답.

## 2. 테스트 커버리지

13건 — jwtService 5 (roundtrip·잘못된 secret·위변조·만료·비-JWT) + auth.middleware 8 (require 4 + optional 4). 분기 100%.

## 3. 보안 / 시크릿

- JWT_SECRET은 env에서 zod min(16)으로 강제 (env.ts).
- Bearer 거부 — RISK-02 완화.
- 위변조 즉시 UnauthorizedError — payload 노출 0.
- optionalAuth에서 throw catch 후 익명 진행 (`_err` 변수명으로 lint 통과).

## 4. 가독성 / 단순성

- jwtService 30줄.
- auth.ts 47줄, extractToken 헬퍼로 prefix 검증 일원화.

## 5. 발견 사항 (3축 OX 분류)

| 발견 | in_scope | blocks_merge | same_area | 처리 |
|---|---|---|---|---|
| optionalAuth에서 verify 실패 시 *왜* 익명 진행 — request 디버깅 어려울 수 있음 | O | X | O | 수용 — 사양에 따라 익명 시나리오 지원 |
| jwtService.verify의 string assert (decoded.userId === number) — 외부 입력 방어 강도 OK | O | X | O | 수용 |
| refresh token 없음 (OQ-04) | O | X | O | brief 명시 — 운영 단계 결정 |

## 6. NEEDS-WORK 항목

(없음)
