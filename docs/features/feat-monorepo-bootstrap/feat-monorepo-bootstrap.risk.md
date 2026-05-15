---
doc_type: feature-risk
version: v0.1
status: Draft
author: yongtae.cho@bespinglobal.com
date: 2026-05-15
gate: feature
related:
  R-ID: [R-N-02, R-N-03, R-N-04]
  F-ID: []
  supersedes: null
---

# feat-monorepo-bootstrap — Feature Risk

<!-- Issue #1 / ISS-INFRA-01. 15-risk.md 11 리스크 중 본 이슈가 직접 트리거하거나 완화의 시발점이 되는 항목 + 본 이슈 단위 신규 리스크. -->

## 변경 이력

| Version | Date | Author | Change |
|---|---|---|---|
| v0.1 | 2026-05-15 | yongtae.cho@bespinglobal.com | 초안 — 3 리스크 식별 |

## 1. 본 변경의 리스크

| RISK-ID | 제목 | 영향(1~5) | 가능성(1~5) | 등급 |
|---|---|---|---|---|
| F-RISK-01 | Node·pnpm·Docker 버전 불일치로 신규 합류자 부트스트랩 실패 | 3 | 3 | M |
| F-RISK-02 | `.env.example`의 placeholder를 실제 시크릿으로 채워서 커밋 | 5 | 1 | M |
| F-RISK-03 | tsconfig.base의 `moduleResolution: bundler`가 Vite 외 환경(Jest 등 후속 툴)과 충돌 | 2 | 2 | L |

## 2. 리스크 상세

### F-RISK-01: Node·pnpm·Docker 버전 불일치

- **카테고리**: 외부 의존
- **트리거 신호**: 신규 합류자(또는 CI runner)가 Node 18 이하, pnpm 8 이하, Docker compose v1 환경. `pnpm install` lockfile 호환성 실패, `docker compose` 명령 미인식 등.
- **완화 전략**:
  1. `package.json`의 `engines` 필드에 `node: ">=20"`·`pnpm: ">=9"` 명시 (본 이슈 #1 커밋 1에 포함)
  2. README/CLAUDE.md 보강 — corepack 안내 (ISS-INFRA-02 acceptance 추가)
  3. CI에서 동일 Node·pnpm 버전 강제 (`.github/workflows/ci.yml` matrix — ISS-CI-01 책임)
- **검증 방법**: P10 AI 게이트에서 `node --version`·`pnpm --version`·`docker --version` 로그 캡처. 본 이슈는 *현재 개발 환경*만 검증. 신규 합류자 시나리오는 ISS-INFRA-02에서 README 업데이트로 흡수.
- **15-risk 매핑**: 본 항목은 15-risk.md에 없는 *이슈 단위 신규 리스크*. 일반 카테고리는 RISK-09 (도입 학습 곡선) 인접.

### F-RISK-02: .env.example placeholder를 실제 시크릿으로 오염

- **카테고리**: 보안
- **트리거 신호**: 개발자가 로컬 `.env` 작업 중 실수로 `.env.example`에 `JWT_SECRET=<실제 값>`을 커밋. CLAUDE.md §보안 1·2·5 위반.
- **완화 전략**:
  1. `.env.example`의 모든 시크릿 위치에 `CHANGE_ME_TO_32_BYTE_RANDOM` 식의 가이드 placeholder만 (본 이슈 커밋 1에 강제)
  2. `.gitignore`에 `.env`·`.env.*`·`*.local` 추가 (본 이슈 커밋 1에 강제)
  3. `.claude/settings.json` PreToolUse hook이 `.env*` 파일 Write/Edit 자동 차단 (이미 toolkit 도입 시 활성)
  4. PR 본문에 `git diff --stat`으로 `.env`·`*.key`·`*.pem` 변경 0 확인 (P10 AI 게이트 5축 중 보안 axis)
- **검증 방법**: 자동 — P10에서 `git diff origin/main..HEAD -- '*.env*' '*.key' '*.pem' '*secret*' '*api_key*'` 출력이 빈 줄이어야 함. 비어 있지 않으면 BLOCKED.
- **15-risk 매핑**: RISK-04 (JWT/secret 노출). 본 이슈는 RISK-04 *시작점* — JWT_SECRET이 처음 등장하는 이슈이므로 가장 강한 가드 필요.

### F-RISK-03: tsconfig.base.json `moduleResolution: bundler` 호환성

- **카테고리**: 호환성
- **트리거 신호**: 후속 이슈에서 Jest(`moduleResolution: node` 요구) 또는 ts-node CLI(`bundler` 미지원 ts버전) 도입 시 type-resolve 실패.
- **완화 전략**:
  1. 본 이슈에서 테스트 러너를 **Vitest로 통일** (vitest는 bundler resolution 지원) — `backend/vitest.config.ts`에 명시
  2. 각 패키지 `tsconfig.json`이 `extends`만 하고 `moduleResolution`을 재정의하지 않음 (`backend`도 동일). 만약 Node CJS 출력이 필요해지면 `tsconfig.build.json` 분리 (ADR 신설)
  3. ESLint·Prettier·Husky(ISS-INFRA-02)는 `import/resolver` 설정에서 typescript 플러그인 사용
- **검증 방법**: P10에서 `pnpm -r typecheck` 통과 + `pnpm -r build` 통과. 후속 이슈 머지 회귀 시 본 검증이 자연 가드.
- **15-risk 매핑**: 본 항목은 15-risk.md에 없는 *이슈 단위 신규 리스크*. 일반 카테고리는 RISK-08 (기술 선택 호환) 인접.

## 3. High 등급 단계적 롤아웃

- 본 이슈에 **High 등급 리스크 없음** (M 2건, L 1건). 단계적 롤아웃 불필요.
- 단일 PR 일괄 머지 — 6 커밋 DAG는 단일 브랜치에서 순차 진행.
- 만약 후속 이슈에서 본 부트스트랩을 *변경*하는 modify 흐름 진입 시(예: pnpm→yarn 전환), 해당 이슈는 High 가능 → ADR + 단계적 롤아웃 필수 (flow-feature.md mode=modify 규칙).

## 4. 데이터 영속성 변경

- **본 이슈는 데이터 영속성 변경 없음**.
- docker-compose.yml의 db 서비스(postgres:16-alpine)는 정의만 — `docker compose up` 미실행 + volumes 매핑은 placeholder. 첫 실제 데이터 발생은 ISS-BE-INIT-02 (`prisma migrate dev --name init`)에서.
- Rollback: `git revert -m 1 <merge-commit>` 1회로 완전 복구. DB 데이터 손상 가능성 0.

## 5. 15-risk.md 갱신 항목

- 본 이슈 머지 후 15-risk.md에 *추가 갱신 없음*. 본 이슈는 risk 식별 후 *완화 전략 시작점*이며 15-risk에 이미 등재된 RISK-04(JWT/secret)·RISK-09(학습 곡선)·RISK-08(호환)에 인접.
- 후속 이슈에서 F-RISK-01·02·03의 완화 검증이 완료되면 15-risk.md §3 "완화 진행" 표에 ✅ 기록 — P13 `/docs-update` 단계 책임.
