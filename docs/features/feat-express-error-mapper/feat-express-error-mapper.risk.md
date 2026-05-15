---
doc_type: feature-risk
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

# feat-express-error-mapper — Feature Risk

## 변경 이력

| Version | Date | Author | Change |
|---|---|---|---|
| v0.1 | 2026-05-15 | yongtae.cho@bespinglobal.com | 초안 |

## 1. 본 변경의 리스크

| RISK-ID | 제목 | 영향(1~5) | 가능성(1~5) | 등급 |
|---|---|---|---|---|
| F-RISK-01 | 비-AppError가 메시지 노출로 시크릿 누수 | 4 | 2 | M |
| F-RISK-02 | ConflictError를 409로 잘못 매핑 — RealWorld 사양 위반 | 3 | 2 | L |

## 2. 리스크 상세

### F-RISK-01: 비-AppError 메시지 노출

- 카테고리: 보안
- 트리거 신호: `throw new Error("DB password: xxx")` 등 비-AppError 발생 시 message가 응답에 그대로 노출되면 시크릿 누수.
- 완화 전략: errorHandler가 instanceof AppError 검사 → false면 body를 "internal server error" 고정. 원본 메시지는 로그에만 (pino).
- 검증 방법: AC-06.
- 15-risk 매핑: RISK-04 (시크릿 노출) 인접.

### F-RISK-02: ConflictError 상태코드

- 카테고리: 호환성
- 완화 전략: 11 §2 표가 422 강제. unit test에서 statusCode === 422 검증.
- 검증 방법: AC-05.

## 3. High 등급 단계적 롤아웃

(High 없음)

## 4. 데이터 영속성 변경

(없음)

## 5. 15-risk.md 갱신 항목

(추가 없음 — RISK-04 완화 진행으로 추후 §3 진행 표에 ✅ 가능)
