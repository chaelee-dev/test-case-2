---
doc_type: feature-acceptance
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

# feat-monorepo-bootstrap — Acceptance Criteria

<!-- Issue #1 / ISS-INFRA-01. WBS DoD 체크리스트(tree 매칭/devkit 동작/docker compose dry-run/PR 본문에 12 인용)를 G/W/T로 풀어 적는다. -->

## 변경 이력

| Version | Date | Author | Change |
|---|---|---|---|
| v0.1 | 2026-05-15 | yongtae.cho@bespinglobal.com | 초안 — AC 5건 |

## 1. 인수 기준 (Given/When/Then)

### AC-01: pnpm 워크스페이스 install 정상

- **Given** 본 PR 머지 직후 clean clone 상태 (Node 20+, pnpm 9+ 설치)
- **When** `pnpm install` 실행
- **Then** 3 패키지(`@conduit/frontend`·`@conduit/backend`·`@conduit/e2e`) 모두 해결 + `pnpm-lock.yaml` 생성 + exit 0
- **측정 방법**: 자동 테스트 (P10 AI 게이트에서 `pnpm install` 명령 실행 + exit code 확인)
- **R-ID**: R-N-04 (배포 — Docker Compose 1줄 실행의 선결)

### AC-02: backend health endpoint 응답

- **Given** AC-01 통과 + `./devkit dev backend` 실행
- **When** 3초 후 `curl http://localhost:3000/health` 호출
- **Then** HTTP 200 + body `{"status":"ok"}` 응답
- **측정 방법**: 자동 테스트 (`backend/src/__tests__/health.test.ts` supertest)
- **R-ID**: R-N-03 (관측 — health 라우트는 traceId 도입 전 부트 검증용)

### AC-03: frontend Vite dev 서버 부팅

- **Given** AC-01 통과 + `./devkit dev frontend` 실행
- **When** 3초 후 `curl http://localhost:5173` 호출
- **Then** Vite HTML 응답 (DOCTYPE html 포함) + HTTP 200
- **측정 방법**: 수동 확인 (휴먼 게이트 D-06 2단 — 브라우저로 http://localhost:5173 접속 + "Conduit boot OK" 확인 + 스크린샷)
- **R-ID**: R-N-04 (배포 — FE 부팅 검증)

### AC-04: docker compose 파싱 통과

- **Given** AC-01 통과 + Docker 24+ 설치
- **When** `docker compose config` 실행
- **Then** exit 0 + 3 서비스(frontend·backend·db) 파싱 완료. 변수 치환 오류 없음
- **측정 방법**: 자동 테스트 (P10 AI 게이트에서 `docker compose config` 실행)
- **R-ID**: R-N-04 (배포 — Docker Compose 1줄 실행의 선결)

### AC-05: devkit 명령 진입점 동작

- **Given** AC-01 통과
- **When** `./devkit help`·`./devkit install all`·`./devkit build all`·`./devkit test backend` 각각 실행
- **Then** 모두 exit 0. help는 도움말 텍스트 출력. install은 pnpm install로 위임. build는 frontend/backend dist 생성. test는 vitest health 1건 PASS
- **측정 방법**: 자동 테스트 (P10 AI 게이트에서 4 명령 순차 실행 + exit code 확인)
- **R-ID**: R-N-04 (배포 — 단일 진입점 ADR-0028 정합)

## 2. Definition of Done (D-06)

- [ ] **단위 테스트**: `backend/src/__tests__/health.test.ts` 1건 PASS (vitest run)
- [ ] **AI 게이트**: `/qa-test --ai` 5축(빌드·typecheck·단위 테스트·docker compose config·devkit help) 모두 PASS — PR 생성 차단 해제 (D-06 1단)
- [ ] **Test Plan 4블록**: PR body에 (1) AC-01~05 결과 (2) Touched Areas (3) Flow Mode + Mode Decision Trace (4) Risk 검토 (15-risk + feature-risk) 4블록 모두 포함
- [ ] **tested 라벨**: P14 휴먼 게이트(`/qa-test --human`) 통과 후 사람이 PR에 `tested` 라벨 부착 (D-06 2단)
- [ ] **Approve**: PR 리뷰어 ≥1명 Approve
- [ ] **CI green**: GitHub Actions CI 모두 PASS — 단, **본 이슈는 CI workflow가 없음** (ISS-CI-01 후속 책임). 본 이슈 머지 시 CI green 조건은 "CI workflow 없음 + branch protection 미설정" 상태에서 면제 처리. 사용자 머지 권한으로 진행. ISS-CI-01 머지 후 본 D-06 조건이 의미를 갖는다.

## 3. 비기능 인수

- **`pnpm install` 시간**: clean cache 기준 ≤120s (Node 20 + 정상 네트워크). 후속 이슈 합산하면 시간 증가 → ISS-CI-01에서 캐시 도입.
- **devkit 응답 시간**: `./devkit help` 1초 이내, `./devkit dev backend` 부팅 5초 이내 (tsx watch 첫 컴파일 포함).
- **docker compose config 시간**: ≤2초.
- **TypeScript strict**: tsconfig.base.json + 각 패키지 tsconfig.json에서 `strict: true` 명시. typecheck 위반 0.

## 4. 회귀 인수

- (없음 — 빈 저장소 첫 부트스트랩, 회귀할 기존 동작 0)
- **후속 이슈에서의 회귀 가드**: ISS-INFRA-02 (lint) 머지 후 본 이슈 산출 파일이 lint 위반을 발생시키지 않아야 함. ISS-CI-01 (CI) 머지 후 본 이슈가 만든 명령(devkit·docker compose)이 CI workflow에서 호출 가능해야 함. 두 회귀는 후속 이슈 acceptance에서 검증.
