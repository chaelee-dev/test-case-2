---
doc_type: feature-risk
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

# feat-user-register-login — Feature Risk

## 변경 이력

| Version | Date | Author | Change |
|---|---|---|---|
| v0.1 | 2026-05-15 | yongtae.cho@bespinglobal.com | 초안 |

## 1. 본 변경의 리스크

| RISK-ID | 제목 | 영향(1~5) | 가능성(1~5) | 등급 |
|---|---|---|---|---|
| F-RISK-01 | password 평문 로깅 — 시크릿 누수 | 5 | 2 | M |
| F-RISK-02 | timing oracle — 미가입 email vs 잘못된 password 응답 시간 차이 | 3 | 3 | M |
| F-RISK-03 | bcrypt cost=12 응답 지연 — UX 영향 | 2 | 3 | L |

## 2. 리스크 상세

### F-RISK-01: password 평문 로깅

- 카테고리: 보안
- 트리거: requestLogger가 req.body를 통째로 로깅하면 password 노출.
- 완화: requestLogger는 method+url만 로깅 (기존 코드 OK). pino 자동 redact 활용 가능 — 본 이슈에서는 manual 검사.
- 검증: code-review §3에서 평문 로깅 검사.
- 15-risk 매핑: RISK-04.

### F-RISK-02: timing oracle

- 카테고리: 보안
- 트리거: 미가입 email은 bcrypt 비교 skip → 빠른 응답. 차이로 email 존재 여부 추측 가능.
- 완화: 미가입 email에도 dummy hash로 bcrypt.compare 실행 (시간 유사). 응답 메시지 동일.
- 검증: AC-06·AC-07.

### F-RISK-03: bcrypt cost=12 지연

- 카테고리: 성능
- 완화: cost=12는 ~80ms (HW 보통). R-N-02 강제값. 후속 조정 시 ADR.
- 검증: 비기능 인수.

## 3. High 등급 단계적 롤아웃

(High 없음)

## 4. 데이터 영속성 변경

- 첫 user 데이터 생성. seed로 2명 + 본 PR 후 가입자.
- Rollback 시 사용자 손실 — sprint 1 초기라 위험 낮음.

## 5. 15-risk.md 갱신 항목

(완화 진행 추적은 후속 docs-update에서 통합)
