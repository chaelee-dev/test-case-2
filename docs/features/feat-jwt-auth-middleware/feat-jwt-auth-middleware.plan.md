---
doc_type: feature-plan
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

# feat-jwt-auth-middleware — Implementation Plan

## 변경 이력

| Version | Date | Author | Change |
|---|---|---|---|
| v0.1 | 2026-05-15 | yongtae.cho@bespinglobal.com | 초안 |

## 1. 커밋 시퀀스 (DAG)

| # | 커밋 | 영향 파일 | 테스트 추가 | 회귀 위험 |
|---|---|---|---|---|
| 1 | `feat(backend): JwtService sign/verify (#6)` | `backend/src/services/jwtService.ts`, deps(jsonwebtoken), `__tests__/jwtService.test.ts` | sign 형식 / verify 정상 / 만료 / 위변조 | 낮음 |
| 2 | `feat(backend): AuthMiddleware requireAuth + optionalAuth (#6)` | `backend/src/middleware/auth.ts`, `__tests__/auth.middleware.test.ts` | Token 정상 / Bearer 거부 / 누락 / 만료 | 중간 |

## 2. 의존성 그래프

```
#1 (JwtService) ──▶ #2 (AuthMiddleware가 jwtService.verify 사용)
```

Blocked-by: 없음. ISS-BE-INIT-01 (UnauthorizedError) 완료됨.

## 3. 테스트 매핑

| 커밋 | 테스트 추가 위치 | 시나리오 |
|---|---|---|
| #1 | `jwtService.test.ts` | sign→verify roundtrip / 만료 토큰 → throw / 잘못된 secret → throw / payload 변조 → throw |
| #2 | `auth.middleware.test.ts` | `Authorization: Token <jwt>` 정상 → req.user 부착 / `Bearer ...` → 401 / 헤더 누락 → 401(require)·통과(optional) / 만료 → 401 |

커버리지: BE services 90% 목표.

## 4. 빌드·실행 검증 단계

```bash
# 동적 (P14)
./devkit test backend     # 위 단위·통합 PASS
```

## 5. 점진 합의 / 결정 발생 항목

- ADR 작성 필요: no.
- 변경 잠재: JWT_SECRET 형식(hex vs base64), refresh token 도입 시 ADR 필수.
