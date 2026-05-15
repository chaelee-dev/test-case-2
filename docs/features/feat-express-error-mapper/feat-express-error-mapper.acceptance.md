---
doc_type: feature-acceptance
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

# feat-express-error-mapper — Acceptance Criteria

## 변경 이력

| Version | Date | Author | Change |
|---|---|---|---|
| v0.1 | 2026-05-15 | yongtae.cho@bespinglobal.com | 초안 |

## 1. 인수 기준 (Given/When/Then)

### AC-01: ValidationError → 422

- Given app 부팅 + 임의 라우트가 `throw new ValidationError("email","is invalid")` 
- When 클라이언트 GET 호출
- Then HTTP 422 + body `{"errors":{"email":["is invalid"]}}`
- 측정 방법: 자동 테스트 (supertest 통합)
- R-ID: R-N-03

### AC-02: UnauthorizedError → 401

- Given 라우트가 `throw new UnauthorizedError("unauthorized")`
- When 호출
- Then HTTP 401 + body `{"errors":{"body":["unauthorized"]}}`
- 측정 방법: 자동 테스트
- R-ID: R-N-03

### AC-03: ForbiddenError → 403

- Given 라우트가 `throw new ForbiddenError("forbidden")`
- When 호출
- Then HTTP 403 + body `{"errors":{"body":["forbidden"]}}`
- 측정 방법: 자동 테스트
- R-ID: R-N-03

### AC-04: NotFoundError → 404

- Given 라우트가 `throw new NotFoundError("article not found")`
- When 호출
- Then HTTP 404 + body `{"errors":{"body":["article not found"]}}`
- 측정 방법: 자동 테스트
- R-ID: R-N-03

### AC-05: ConflictError → 422 (409 아님)

- Given 라우트가 `throw new ConflictError("username","has already been taken")`
- When 호출
- Then HTTP 422 + body `{"errors":{"username":["has already been taken"]}}`
- 측정 방법: 자동 테스트
- R-ID: R-N-03

### AC-06: 비-AppError → 500 (메시지 마스킹)

- Given 라우트가 `throw new Error("DB connection refused")`
- When 호출
- Then HTTP 500 + body `{"errors":{"body":["internal server error"]}}` (원본 메시지 노출 금지)
- 측정 방법: 자동 테스트
- R-ID: R-N-03

### AC-07: traceId 로깅

- Given 임의 요청
- When 처리 완료
- Then 로그에 `traceId` 포함 (UUID v4)
- 측정 방법: 자동 테스트 (로거 mock)
- R-ID: R-N-03

## 2. Definition of Done (D-06)

- [ ] 단위 테스트: 3 파일 (errors·env·errorHandler) PASS
- [ ] 통합 테스트: app.integration 5 에러 케이스
- [ ] AI 게이트: 정적 검증 PASS
- [ ] Test Plan 4블록: PR 본문
- [ ] tested 라벨: 휴먼 게이트 후
- [ ] Approve: 1명
- [ ] CI green: ISS-CI-01 BLOCKED 상태 → 본 PR도 N/A

## 3. 비기능 인수

- 에러 처리 응답 시간 ≤10ms (예외 throw → 미들웨어 처리).
- 로그 형식 JSON (pino 기본).

## 4. 회귀 인수

- 기존 /health 200 응답 형식 동일 유지.
- 후속 서비스 이슈가 `import { ValidationError } from '@/errors'`로 사용 가능.
