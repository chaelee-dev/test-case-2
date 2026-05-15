---
doc_type: test-design
version: v0.1 (Draft)
status: Draft
author: yongtae.cho@bespinglobal.com
date: 2026-05-15
gate: C
related:
  R-ID: [R-N-02, R-N-05]
  F-ID: []
  supersedes: null
---

# 04-performance Performance & Security Tests — test-design

## 변경 이력

| Version | Date | Author | Change |
|---|---|---|---|
| v0.1 | 2026-05-15 | yongtae.cho@bespinglobal.com | 초안 — 부하 SLO + 보안 정적·동적 |

## 1. 성능 테스트

- **목표 SLO (R-N-05)**: 단일 인스턴스 + 20 RPS × 5분 부하 → BE p95 < 300ms, 5xx 0건.
- **주요 시나리오 (k6 스크립트)**:
  - `GET /api/articles?limit=20&offset=0` (가장 빈도 높은 호출).
  - `POST /api/users/login` + `GET /api/user` (인증 사이클).
  - `POST /api/articles` (트랜잭션 부하).
- **측정 대상**: BE 응답 시간 p50/p95/p99 + DB 쿼리 시간 + Prisma 쿼리 수.
- **MVP 정책**: 측정만 수행, SLO 위반 시 14 리스크 등록 후 ADR. 차단은 운영 단계로 deferral.
- **FE 성능**: TTI/LCP는 본 단계에서 측정 안 함. 운영 단계 Lighthouse 도입.

## 2. 보안 테스트

- **정적 분석 (매 PR)**:
  - ESLint 보안 룰셋(`eslint-plugin-security`) — eval, child_process 등 위험 패턴 감지.
  - `npm audit` (또는 `pnpm audit`) — HIGH 이상 취약점 차단.
- **동적 (E2E 안)**:
  - **XSS (R-F-18)**: 글 body·comment body에 `<script>`·`<iframe>`·`onerror` 페이로드 → 렌더 결과 미실행 검증 (F-06 E2E).
  - **JWT 위조 (R-N-02)**: 자체 비밀로 서명한 JWT를 `Authorization: Token <forged>` → 401.
  - **권한 우회**: 사용자 A 토큰으로 사용자 B의 글 PUT/DELETE → 403.
  - **CORS**: 허용되지 않은 Origin 요청 → preflight 거절.
- **시크릿 노출**: pre-commit + CI에서 `.env*`/`*.key`/`*.pem` 패턴 차단 (CLAUDE.md §보안).
- **비범위(MVP)**:
  - 침투 테스트(외부 벤더). 운영 단계.
  - SSRF/SSTI 풀세트 — 본 시스템은 외부 호출 0건이므로 노출 표면 작음.
  - Rate Limit 우회 — Rate Limit이 MVP에서 미적용(09 §5).

## 3. 도구·시점

| 종류 | 도구 | 시점 | R-ID |
|---|---|---|---|
| 부하 (BE) | k6 0.50 (옵션) | 운영 단계 또는 사용자 요청 시 | R-N-05 |
| 정적 보안 | ESLint + npm audit | 매 PR (CI) | R-N-02 |
| XSS / 권한 | Playwright (F-06 / F-08 시나리오 내) | 매 PR (스모크), main 머지 (풀) | R-F-18, R-N-02 |
| 비밀 누출 가드 | settings.json PreToolUse hook + CI grep | 매 commit | 보안(CLAUDE.md) |
| Postman 회귀 (사양 적합) | Newman | 매 PR (CI) | R-N-01 |
| 의존성 취약점 | `pnpm audit` | 매 PR + 일 1회 cron | (운영) |
