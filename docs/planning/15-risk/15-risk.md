---
doc_type: risk
version: v0.1 (Draft)
status: Draft
author: yongtae.cho@bespinglobal.com
date: 2026-05-15
gate: operations
related:
  R-ID: [R-F-18, R-N-01, R-N-02, R-N-04, R-N-05]
  F-ID: [F-01, F-05, F-06]
  supersedes: null
---

# Conduit (RealWorld) — Risk Register

<!-- /flow-wbs Phase 3 산출. WBS 우선순위 보정 입력. -->

## 변경 이력

| Version | Date | Author | Change |
|---|---|---|---|
| v0.1 | 2026-05-15 | yongtae.cho@bespinglobal.com | 초안 — 11 리스크(외부 의존·보안·일정·운영·기술) |

## 1. 리스크 일람

| RISK-ID | 제목 | 영향(1~5) | 가능성(1~5) | 등급 | 영향 받는 Sprint/Issue | 대응 |
|---|---|---|---|---|---|---|
| RISK-01 | RealWorld 사양 변경 / netlify 다운 | 4 | 2 | M | Sprint 2·3 (R-N-01 회귀) | Postman 컬렉션 사본 git 커밋 + 사양 본문 04 SRS 인용 |
| RISK-02 | 외부 RealWorld FE와 헤더 호환 깨짐 (Bearer vs Token) | 3 | 3 | M | Sprint 1 (인증) | 사양 충실 `Token` 고정 + Newman 회귀 BLOCK + 헤더 단위 테스트 |
| RISK-03 | XSS via 마크다운 본문 (R-F-18) | 5 | 3 | H | Sprint 2 (글 상세) | DOMPurify 화이트리스트 + F-06 E2E XSS 페이로드 시나리오 + ESLint 보안 룰 |
| RISK-04 | JWT 비밀 노출 / localStorage 토큰 탈취 | 5 | 2 | H | Sprint 1 (인증) | `.env` gitignore + secret 누출 hook + 12-scaffolding §6 분리. localStorage는 사양 충실(추후 cookie 대체는 ADR로) |
| RISK-05 | slug 충돌 (동일 title 다중) | 2 | 3 | L | Sprint 2 (글 작성) | base36 6자 hash suffix + 단위 테스트 + 운영 단계 로그 모니터링 |
| RISK-06 | Prisma cascade 누락으로 orphan 행 | 4 | 2 | M | Sprint 2 (글 삭제) | schema.prisma cascade 명시 + 통합 테스트 자식 행 0 검증 |
| RISK-07 | Newman/Postman 컬렉션과 본 BE 응답 형식 어긋남 | 4 | 3 | H | Sprint 1·2·3 (R-N-01) | 09 LLD API Spec을 사양 1:1로 유지 + CI Newman 머지 차단 + 응답 형식 단위 테스트 |
| RISK-08 | E2E 부동(flaky) — 동기화 이슈 | 2 | 4 | M | Sprint 3 (E2E) | Playwright auto-wait 사용 + 명시적 `expect.toHaveURL` + 1회 재시도 후 BLOCK |
| RISK-09 | dev 환경 SQLite vs prod PG 동작 차이 | 3 | 3 | M | Sprint 3 (배포) | Prisma SQL 호환 영역만 사용 + 통합 테스트는 PG matrix 1회 + 운영 진입 전 마이그레이션 dry-run |
| RISK-10 | 일정 압박 — MVP 3 sprint 초과 | 3 | 3 | M | Sprint 1·2·3 (전체) | 외부 RealWorld FE 상호운용 KPI는 운영 deferral 후보 + 부하 테스트 deferral + WBS 추정 보수적 |
| RISK-11 | toolkit hook 차단으로 작업 중단 (분량/보안) | 2 | 2 | L | Sprint 1·2·3 (전반) | 운영 문서만 300줄 가드(WARN-only) + 시크릿은 PreToolUse 차단. 산출 문서는 가드 외 |

> 등급 산식: 등급 = 영향 × 가능성. **L** ≤ 6, **M** 7~12, **H** ≥ 13 (3×4=12 경계는 M).

## 2. 리스크 상세

### RISK-01: RealWorld 사양 변경 / netlify 다운

- **카테고리**: 외부 의존
- **설명**: 본 프로젝트의 사양 정본은 `realworld-docs.netlify.app` 외부 문서. 사이트 다운 시 학습 손실, 사양 일부 변경(예: 2024/08 articlesCount body 제거) 시 본 구현이 어긋날 수 있음.
- **영향**: 4 (Newman 회귀 깨짐 → 머지 차단 → 일정 손실).
- **가능성**: 2 (변경 빈도 < 1회/년).
- **현재 상태**: 식별
- **트리거 신호**: Newman 23 케이스 중 새로 추가된 케이스가 실패 / netlify 사이트 5xx 1주 이상.
- **완화 전략**: (a) Postman 컬렉션을 본 저장소에 사본으로 커밋(`e2e/newman/conduit.postman_collection.json`). (b) 04 SRS·09 API Spec에 핵심 페이로드 인용. (c) netlify 다운 시에도 본 저장소 산출로 자급.
- **대응 이슈**: ISS-OPS-01(Newman seed + 컬렉션 동기화).

### RISK-02: 외부 RealWorld FE와 헤더 호환 깨짐 (Bearer vs Token)

- **카테고리**: 외부 의존
- **설명**: RealWorld 사양은 `Authorization: Token <jwt>` 명시이나 일부 구현체는 `Bearer` 사용. 본 BE는 사양 충실 → 외부 FE 구현체와 헤더 형식 불일치 가능.
- **영향**: 3 (외부 상호운용 KPI에 직접 — 01 §4 마지막 행, MVP에 둘 경우).
- **가능성**: 3 (구현체별 편차 흔함).
- **현재 상태**: 식별
- **트리거 신호**: 외부 RealWorld FE로 본 BE 호출 시 401 다수.
- **완화 전략**: 사양 충실 `Token` 고정. `Bearer prefix` 거절을 단위 테스트로 강제. 외부 FE 호환 KPI는 운영 단계 deferral 가능 (01 §4·05 OQ-P1).
- **대응 이슈**: ISS-BE-AUTH-02(AuthMiddleware 헤더 파서 단위).

### RISK-03: XSS via 마크다운 본문 (R-F-18)

- **카테고리**: 보안
- **설명**: Article body는 마크다운 입력. sanitizer 누락/약함 시 `<script>`·`onerror`·`javascript:` 스킴 등으로 XSS 발생.
- **영향**: 5 (모든 사용자 세션 탈취 가능, JWT가 localStorage).
- **가능성**: 3 (마크다운 sanitizer 기본 옵션이 약함 + 신규 페이로드 발견 흔함).
- **현재 상태**: 식별
- **트리거 신호**: F-06 E2E XSS 시나리오 fail / 외부 보안 보고.
- **완화 전략**: DOMPurify 화이트리스트(태그·속성·URL 스킴) + F-06 E2E에 페이로드 5종 이상 + 정기 의존성 audit.
- **대응 이슈**: ISS-FE-MD-03(Markdown sanitizer + XSS E2E).

### RISK-04: JWT 비밀 노출 / localStorage 토큰 탈취

- **카테고리**: 보안
- **설명**: `JWT_SECRET`이 git 커밋되면 모든 사용자 토큰 위조 가능. 또한 localStorage 저장 JWT는 XSS 시 탈취됨(RISK-03과 연결).
- **영향**: 5 (전 사용자 영향).
- **가능성**: 2 (CLAUDE.md §보안 + PreToolUse hook으로 차단).
- **현재 상태**: 모니터링 (자동 hook 작동 중).
- **트리거 신호**: git에 `.env`/`*.key`/`*.pem` 패턴 commit 시도 / Sentry 의심 토큰 위조 로그.
- **완화 전략**: (a) `.env*` gitignore + settings.json PreToolUse 차단. (b) JWT_SECRET 32바이트 이상 랜덤 + 운영에서 secret manager. (c) DOMPurify 강화(RISK-03 완화). (d) 옵션: HttpOnly cookie 도입은 ADR 신설로.
- **대응 이슈**: ISS-OPS-04(env loader + secret guard 검증).

### RISK-05: slug 충돌 (동일 title 다중)

- **카테고리**: 기술
- **설명**: 동일 title로 글 N건 작성 시 slug 충돌. 1차 hash suffix로 해결되나 운영 누적 시 매우 희박한 추가 충돌 가능.
- **영향**: 2 (글 작성 실패 1건, 후속 글 정상).
- **가능성**: 3 (테스트 환경에서 자주 발생).
- **현재 상태**: 식별
- **트리거 신호**: ArticleService.generateSlug throw `SlugCollisionExhausted`.
- **완화 전략**: kebab + 6자 base36 해시 + 그래도 충돌 시 throw. 운영 단계에서 충돌률 로그 모니터링.
- **대응 이슈**: ISS-BE-ART-09(글 작성 + slug 생성기 단위).

### RISK-06: Prisma cascade 누락으로 orphan 행

- **카테고리**: 기술
- **설명**: Article 삭제 시 Comment·Favorite·ArticleTag가 같이 안 지워지면 orphan 발생, 후속 쿼리 오류 또는 데이터 무결성 위반.
- **영향**: 4 (사양 불일치 + Newman 깨짐).
- **가능성**: 2 (schema.prisma 명시 시 자동).
- **현재 상태**: 식별
- **트리거 신호**: 통합 테스트 "Article 삭제 후 자식 행 0" 실패.
- **완화 전략**: schema.prisma에서 cascade 옵션 명시 + 통합 테스트로 자식 행 0 검증.
- **대응 이슈**: ISS-BE-ART-10(글 삭제 cascade 통합).

### RISK-07: Newman/Postman 컬렉션과 본 BE 응답 형식 어긋남

- **카테고리**: 외부 의존
- **설명**: 09 API Spec과 본 BE 구현이 어긋나면 Newman 실패 → 머지 차단(R-N-01).
- **영향**: 4 (전 PR 차단).
- **가능성**: 3 (구현 초반 잦음).
- **현재 상태**: 식별
- **트리거 신호**: CI Newman job RED.
- **완화 전략**: (a) ErrorMapper 단일 경로 + 응답 직렬화 단위 테스트. (b) 09 API Spec 행을 PR 본문에 인용. (c) 헬퍼 `serializeArticle`/`serializeUser` 1곳 격리.
- **대응 이슈**: ISS-OPS-02(Newman CI workflow).

### RISK-08: E2E 부동(flaky) — 동기화 이슈

- **카테고리**: 기술
- **설명**: 비동기 UI 갱신(❤ 카운트, follow 상태) Playwright가 너무 일찍 검증해 가끔 fail.
- **영향**: 2 (회귀 재실행 비용 + 신뢰도 저하).
- **가능성**: 4 (E2E 일반적).
- **현재 상태**: 식별
- **트리거 신호**: Playwright 보고서에 같은 테스트 retry 후 PASS / 2회 연속 fail.
- **완화 전략**: `await expect(...).toHaveText(...)` 등 auto-wait + msw에서 정확한 응답 모사 + 1회 재시도 한도.
- **대응 이슈**: ISS-E2E-08(E2E 안정화 가이드 + 실행 정책).

### RISK-09: dev SQLite vs prod PostgreSQL 동작 차이

- **카테고리**: 기술
- **설명**: SQLite는 일부 SQL 기능(예: `ILIKE`, partial index)이 다르거나 없음. Prisma가 추상화하나 100%는 아님.
- **영향**: 3 (운영 진입 단계 회귀 가능).
- **가능성**: 3 (자주 보고됨).
- **현재 상태**: 식별
- **트리거 신호**: prod 마이그레이션 fail / 동일 쿼리 결과 차이.
- **완화 전략**: Prisma의 호환 SQL만 사용(원시 SQL 금지 — 11 §6 정합). 통합 테스트 matrix에 PG 1회. 운영 진입 전 마이그레이션 dry-run.
- **대응 이슈**: ISS-OPS-09(PG 마이그레이션 dry-run).

### RISK-10: 일정 압박 — MVP 3 sprint 초과

- **카테고리**: 일정
- **설명**: 19 API + 11 F-ID + 카탈로그 + 회귀 + Docker compose까지 3 sprint(15 working day) 안에 못 끝낼 가능성.
- **영향**: 3 (운영 진입 지연).
- **가능성**: 3 (1 FTE × 풀스택 + 자율개발 하네스 첫 dogfood).
- **현재 상태**: 식별
- **트리거 신호**: Sprint 1 종료 시점 burndown DAG 잔여 > 30%.
- **완화 전략**: (a) MVP에서 deferrable 항목 명시(외부 FE 상호운용 KPI · 부하 테스트). (b) 14 WBS 추정 보수적. (c) Sprint 종료마다 retro + 우선순위 재조정.
- **대응 이슈**: ISS-OPS-10(retro 1회/sprint).

### RISK-11: toolkit hook 차단으로 작업 중단 (분량/보안)

- **카테고리**: 운영
- **설명**: settings.json hook이 운영 문서 300줄 초과 WARN, 시크릿 파일 Write/Edit BLOCK. 실수로 운영 문서가 비대해지면 노이즈 + 시크릿 패턴 매칭 false positive 가능.
- **영향**: 2 (재작업 비용).
- **가능성**: 2 (CLAUDE.md 숙지 시 낮음).
- **현재 상태**: 모니터링 (자동 hook 작동 중).
- **트리거 신호**: hook stderr WARN 누적 / 의도적 차단 발생.
- **완화 전략**: 산출 문서는 자유 분량(가드 외). 운영 문서는 분할 정책 따름 (`file-numbering.md`). 보안 패턴 false positive 시 우회보다 패턴 정밀화 권고.
- **대응 이슈**: 없음(메타 운영).

## 3. High 리스크 단계적 롤아웃

- **High 식별**: RISK-03(XSS), RISK-04(JWT/secret), RISK-07(사양 적합도). 세 건은 머지 차단 가드 + E2E 강제.

### Step 1 — Sprint 1 (인증·기반)

- RISK-04 우선 완화: env loader(`config/env.ts`) + secret guard 검증 단위 테스트 → ISS-OPS-04 (Sprint 1).
- RISK-07 미리 도입: Newman CI workflow 부트스트랩(빈 컬렉션이라도 실행). ErrorMapper 단위 테스트 → ISS-OPS-02 (Sprint 1).
- RISK-04 게이트: Sprint 1 머지 전 .env 누출 시뮬 → CI에서 차단되는지 확인.

### Step 2 — Sprint 2 (글·댓글·즐겨찾기)

- RISK-03 완화 시점: M-FE-Markdown 도입 시점에 XSS E2E 페이로드 5종 일괄 추가 → ISS-FE-MD-03 (Sprint 2).
- RISK-06 완화: schema.prisma cascade + 통합 테스트. 글 삭제 이슈에 묶음 → ISS-BE-ART-10 (Sprint 2).
- RISK-07 누적 검증: Sprint 2 마지막 PR에서 Newman 23 케이스 PASS 의무화.

### Step 3 — Sprint 3 (E2E·QA·배포)

- RISK-03 누적 회귀: F-06 XSS 시나리오를 풀 E2E에 포함.
- RISK-04 보강: 운영 진입 시 JWT_SECRET 회전 절차(운영 단계 ADR).
- RISK-09 게이트: PG 매트릭스 통합 테스트 1회 + 마이그레이션 dry-run → ISS-OPS-09 (Sprint 3).
- 운영 진입 전 “High 리스크 dashboard 0건” 확인 (eng-review 재실행).

> **Rollback 트리거**: 어떤 sprint든 RISK-03/04/07이 “발생” 상태로 1건 이상이면 PR 머지 중단 + 사용자에게 보고 + 핫픽스 이슈 신설.
