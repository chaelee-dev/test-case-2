---
doc_type: feature-risk
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

# feat-jwt-auth-middleware — Feature Risk

## 변경 이력

| Version | Date | Author | Change |
|---|---|---|---|
| v0.1 | 2026-05-15 | yongtae.cho@bespinglobal.com | 초안 |

## 1. 본 변경의 리스크

| RISK-ID | 제목 | 영향(1~5) | 가능성(1~5) | 등급 |
|---|---|---|---|---|
| F-RISK-01 | JWT_SECRET 약함 또는 노출 → 토큰 위변조 가능 | 5 | 2 | M |
| F-RISK-02 | Bearer/Token 혼동 — 다른 라이브러리 토큰 형식 충돌 | 3 | 3 | M |

## 2. 리스크 상세

### F-RISK-01: JWT_SECRET 약함/노출

- 카테고리: 보안
- 트리거 신호: dev에서 32바이트 미만 secret 사용 또는 git에 secret 커밋.
- 완화 전략: config/env.ts에서 `JWT_SECRET.length >= 16` 강제 (이미 ISS-BE-INIT-01에서 도입). `.gitignore` `.env` + `.env.example` placeholder만. 추후 prod 운영 시 시크릿 매니저.
- 검증 방법: env.test.ts AC-04.
- 15-risk 매핑: RISK-04 (JWT/secret) 직접.

### F-RISK-02: Bearer/Token 혼동

- 카테고리: 호환성
- 트리거 신호: 클라이언트가 `Bearer` prefix 사용 (다른 OAuth/JWT 라이브러리 기본).
- 완화 전략: AuthMiddleware가 `Token` prefix만 허용. 단위 테스트로 Bearer 거부 명시.
- 검증 방법: AC-03.
- 15-risk 매핑: RISK-02 (RealWorld 사양 불일치).

## 3. High 등급 단계적 롤아웃

(High 없음)

## 4. 데이터 영속성 변경

(없음)

## 5. 15-risk.md 갱신 항목

(RISK-02·04 완화 진행 추적 — 후속 PR에서 통합)
