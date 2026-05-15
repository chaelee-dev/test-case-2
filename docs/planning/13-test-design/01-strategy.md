---
doc_type: test-design
version: v0.1 (Draft)
status: Draft
author: yongtae.cho@bespinglobal.com
date: 2026-05-15
gate: C
related:
  R-ID: [R-N-01, R-N-06]
  F-ID: []
  supersedes: null
---

# 01-strategy Test Strategy — test-design

<!-- ADR-0034: 본 sub-file은 방법론·레벨·커버리지(≥80%) BLOCK. -->

## 변경 이력

| Version | Date | Author | Change |
|---|---|---|---|
| v0.1 | 2026-05-15 | yongtae.cho@bespinglobal.com | 초안 — 비-TDD + 3축(단위/통합/E2E) + 커버리지 ≥ 80% |

## 1. 방법론 (TDD/BDD)

- **채택**: **비-TDD** (Test-After/Parallel) + 부분 BDD 어휘.
- **이유**:
  - RealWorld 사양은 외부 정본(Postman 컬렉션 + UI 템플릿)이 이미 검증 기준을 제공. 테스트 “설계”는 끝났고, 본 프로젝트는 그 사양을 만족시키는 구현이다.
  - 04 SRS·05 PRD에 각 R-ID/F-ID별 Happy + Failure 시나리오가 이미 BDD 형식(Given/When/Then)으로 작성되어 있다. 13/02-catalog가 그것을 fan-in.
  - TDD 강제는 본 사양 규모(19 엔드포인트 + 11 F-ID)에 비해 과잉. 단, 회귀 위험 영역(slug 생성기·JWT·sanitizer)은 *Test-First* 권고.
- **BDD 표기**: Acceptance 기술 시 “Given/When/Then” 유지 (04·05에서 이어받음). 시나리오 함수명은 `should_<expected>_when_<context>` 권고.
- **테스트는 다음 3개 레벨로 분류한다** — 단위 / 통합 / E2E. 본 전략에서 모든 R-ID·F-ID가 3 레벨에 대한 결정(✅ 또는 N/A)을 가져야 한다 (ADR-0023).

## 2. 도구 선택

| 레벨 | 도구 | 이유 |
|---|---|---|
| 단위 (BE) | Vitest 1 | tsc 빠른 부팅 + ESM 친화 + jest 호환 API |
| 단위 (FE) | Vitest 1 + React Testing Library 14 + msw 2 | hook·컴포넌트 테스트 + fetch 모킹 |
| 통합 (BE) | Vitest 1 + supertest 6 + 실 SQLite | Express 라우터 + Prisma 실 DB |
| 통합 (FE) | (해당 없음 — FE 단독 통합은 E2E로 흡수) | M-FE-Pages·Components 묶음은 E2E로 |
| E2E | Playwright 1.43 (chromium·firefox·webkit) | 사양상 “최신 Chrome/Firefox/Safari”(R-N-06) — 멀티 브라우저 한 번에 |
| 표준 적합 회귀 | Newman 6 (RealWorld 공식 Postman) | R-N-01 정본 검증 |
| 부하 (선택) | k6 0.50 (운영 단계로 deferral 가능) | R-N-05 |
| 정적 분석 | ESLint 9 + tsc strict | Lint·타입 — 11 §5 정합 |
| 커버리지 측정 | Vitest `--coverage` (v8 또는 istanbul) | 단위·통합 라인 커버리지 |

## 3. 커버리지 목표 (≥ 80%)

- **BE services**: line coverage ≥ **90%** (도메인 로직 핵심).
- **BE repos/routes/middleware**: line coverage ≥ **80%** (통합 테스트로 흡수).
- **FE hooks/api/markdown**: line coverage ≥ **85%** (XSS sanitizer는 분기 100% 권고).
- **FE pages/components**: line coverage ≥ **80%** (RTL 단위 + E2E 보조).
- **전체 모노레포**: line coverage ≥ **80%** (ADR-0015 §2.3 BLOCK 충족).
- **E2E 골든패스**: F-01~F-11에 대해 최소 1건의 E2E 시나리오 — 라우트 7종 모두 도달·렌더 검증 (브리프 §4 KPI).
- **Postman/Newman**: 23 케이스 전수 PASS 100%. 부분 PASS = 머지 차단 (R-N-01).

> 본 커버리지 목표 80%는 ADR-0015 §2.3과 schema(strategy_must_contain) BLOCK을 모두 충족. 분야별 예외(예: `frontend/src/styles/`, 마이그레이션 SQL)는 측정 제외 디렉토리로 정의 — `coverage.exclude`.
