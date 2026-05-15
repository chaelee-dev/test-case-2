---
doc_type: feature-code-review
version: v0.1
status: Draft
author: yongtae.cho@bespinglobal.com
date: 2026-05-15
gate: feature
related:
  R-ID: [R-N-03]
  F-ID: []
  supersedes: null
---

# feat-express-error-mapper — Code Review

## 변경 이력

| Version | Date | Author | Change |
|---|---|---|---|
| v0.1 | 2026-05-15 | yongtae.cho@bespinglobal.com | 초안 |

## 0. Verdict

- verdict: PASS
- reviewer: yongtae.cho@bespinglobal.com
- review_at: 2026-05-15

## 1. 컨트랙트 충실도

contract §2 11 항목 100% 매핑. 11-conventions §2 5 에러 클래스 prefix 정합 (Conflict는 422). `errors/`·`middleware/`·`config/` 디렉토리 12-scaffolding §1 정합.

## 2. 테스트 커버리지

단위 테스트 3 파일 19건:
- errors.test.ts 7건 (5 클래스 + 마스킹 + instanceof)
- env.test.ts 6건 (정상 + 4 실패 케이스 + CORS 파싱)
- errorHandler.test.ts 6건 (5 에러 + 비-AppError 마스킹)

통합 테스트 1 파일 7건:
- app.integration.test.ts (health + 5 에러 + 비-AppError)

총 26건. BE services 90% 커버 목표 달성 예상 (13-test-design §1).

## 3. 보안 / 시크릿

- 비-AppError 메시지 마스킹 (`internal server error` 고정). F-RISK-01 완화 ✅.
- env.ts에서 JWT_SECRET 길이 ≥16 강제 (zod min). 짧은 시크릿 부팅 차단.
- 로그(pino)는 traceId만, 시크릿·비밀번호 로깅 0.
- CORS allow-list 화이트리스트만.

## 4. 가독성 / 단순성

- errors/types.ts 60줄 — 5 클래스 단순 상속.
- errorHandler.ts 11줄 — 분기 1개 (AppError instanceof).
- 11-conventions §6 import 순서: builtin·external·내부 alias·상대 순. import/order 룰 정합.

## 5. 발견 사항 (3축 OX 분류)

| 발견 | in_scope | blocks_merge | same_area | 처리 |
|---|---|---|---|---|
| `mountDomainRoutes` 헬퍼는 후속 이슈에서 사용 — 본 PR에서는 unused | O | X | O | 수용 — ISS-BE-USR-01에서 사용 예정 |
| pino-http는 deps에 있으나 미사용 — requestLogger가 자체 구현 | O | X | O | deferred — 후속 이슈에서 pino-http로 교체 시 deps 그대로 |
| zod 에러 메시지 i18n — 영문만 | O | X | O | deferred — 사양은 영문 |

## 6. NEEDS-WORK 항목

(없음)
