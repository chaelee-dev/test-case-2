---
doc_type: feature-acceptance
version: v0.1
status: Draft
author: yongtae.cho@bespinglobal.com
date: 2026-05-15
gate: feature
related:
  R-ID: [R-N-01]
  F-ID: []
  supersedes: null
---

# feat-newman-ci — Acceptance Criteria

## 변경 이력

| Version | Date | Author | Change |
|---|---|---|---|
| v0.1 | 2026-05-15 | yongtae.cho@bespinglobal.com | 초안 |

## 1. 인수 기준 (Given/When/Then)

### AC-01: collection JSON 파싱 OK

- Given Postman v2.1 컬렉션 파일
- When JSON.parse
- Then OK
- 측정: 자동 (정적)
- R-ID: R-N-01

### AC-02: newman runner 실행

- Given BE 띄운 상태
- When `pnpm --filter @conduit/e2e test:newman`
- Then exit 0 (placeholder 1 케이스 PASS)
- 측정: 수동 P14
- R-ID: R-N-01

### AC-03: BE 미실행 시 graceful 실패

- Given BE 미실행
- When `pnpm --filter @conduit/e2e test:newman`
- Then exit 1 + 에러 메시지 (BE 부재 안내)
- 측정: 수동 P14
- R-ID: R-N-01

## 2. Definition of Done (D-06)

- [ ] collection 정적 검증
- [ ] AI 정적
- [ ] Test Plan 4블록
- [ ] tested 라벨 P14
- [ ] Approve 1
- [ ] CI green N/A (BLOCKED)

## 3. 비기능 인수

- 23 케이스 실행 시간 ≤60초 권고.

## 4. 회귀 인수

- 후속 이슈에서 23 케이스 채움 시 본 골격이 변형 없이 사용 가능해야 함.
