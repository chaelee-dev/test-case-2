---
doc_type: feature-code-review
version: v0.1
status: Draft
author: yongtae.cho@bespinglobal.com
date: 2026-05-15
gate: feature
related:
  R-ID: [R-N-05]
  F-ID: []
  supersedes: null
---

# feat-prisma-schema — Code Review

## 변경 이력

| Version | Date | Author | Change |
|---|---|---|---|
| v0.1 | 2026-05-15 | yongtae.cho@bespinglobal.com | 초안 |

## 0. Verdict

- verdict: PASS
- reviewer: yongtae.cho@bespinglobal.com
- review_at: 2026-05-15

## 1. 컨트랙트 충실도

§2 매핑 OK. schema 5 model + 2 join 모두 04 §5 정합. snake_case @map 사용.

## 2. 테스트 커버리지

prisma.config.test.ts 2건 (singleton + reconnect). 마이그레이션·seed 실증은 휴먼 게이트.

## 3. 보안 / 시크릿

seed의 STUB_HASH는 가짜 — bcrypt 형식 호환 불가, 본 hash로 로그인 불가. 의도된 placeholder. ISS-BE-USR-01에서 실 bcrypt cost=12로 교체 필수. CLAUDE.md §보안 정합.

## 4. 가독성 / 단순성

schema 100줄 — 5 model + 2 join 직관. seed 90줄 — 직선 흐름.

## 5. 발견 사항 (3축 OX 분류)

| 발견 | in_scope | blocks_merge | same_area | 처리 |
|---|---|---|---|---|
| seed STUB_HASH가 bcrypt 형식과 호환 안 됨 | O | X | O | 의도 — USR-01에서 교체 |
| User → Article cascade 미설정 (author 삭제 시 article 처리 미정) | O | X | O | brief OQ-D2 — RealWorld 사양 미명시. 후속 결정 |
| SQLite는 boolean 미지원 — 본 schema는 boolean 미사용 | X | X | O | 비-이슈 |

## 6. NEEDS-WORK 항목

(없음)
