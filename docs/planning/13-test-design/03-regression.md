---
doc_type: test-design
version: v0.1 (Draft)
status: Draft
author: yongtae.cho@bespinglobal.com
date: 2026-05-15
gate: C
related:
  R-ID: [R-N-01]
  F-ID: []
  supersedes: null
---

# 03-regression Regression Test Policy — test-design

## 변경 이력

| Version | Date | Author | Change |
|---|---|---|---|
| v0.1 | 2026-05-15 | yongtae.cho@bespinglobal.com | 초안 — Newman 회귀 + 단위·통합 전수 + E2E 골든패스 |

## 1. 회귀 범위

- **전수 회귀(매 PR)**: 단위 + 통합 + E2E 골든패스 + Newman 23 케이스 + lint·typecheck. 통과 없으면 머지 차단.
- **부분 회귀(스모크)**: 02-catalog §3의 F-01·F-03·F-05·F-06 E2E (브라우저 1종 chromium만). 빠른 피드백.
- **회귀 제외 영역**:
  - `frontend/src/styles/*` (CSS 변경) — 시각 회귀는 별도 도구 없이 운영 단계 deferral.
  - 마이그레이션 SQL 본문 — Prisma 마이그레이션은 dev DB에서만 검증.
  - 부하 테스트 k6 — 운영 단계로 deferral (R-N-05).

## 2. 자동화 정책

- **CI 트리거(GitHub Actions 가정)**:
  - PR 열림/푸시 → `pnpm -w lint && pnpm -w typecheck && pnpm -w test`.
  - PR 라벨 `e2e:run` 또는 main 머지 → Playwright + Newman 풀세트.
- **로컬 자동화(pre-commit)**: lint-staged → ESLint·Prettier 대상 파일만. 단위 테스트는 수동(`./devkit test all`).
- **회귀 결과 캐싱**: Playwright trace는 실패 시에만 artifacts 업로드. 성공은 보고만.
- **재시도 정책**: E2E flaky 회피용 1회 자동 재시도. 2회 연속 실패 시 머지 차단 + 이슈 등록 의무.
- **Newman 회귀 핵심**: R-N-01의 골수 — 사양 변경 없이 본 회귀 깨지면 PR 거절. 사양이 바뀌면 Postman 컬렉션 갱신 + ADR 명시.

## 3. 회귀 트리거

| 이벤트 | 트리거되는 회귀 | 차단 |
|---|---|---|
| PR open / push (FE/BE) | 단위 + 통합 + 스모크 E2E + lint·typecheck + Newman | 머지 차단 |
| PR main 직전 | 풀 E2E(3 브라우저) + Newman 전수 | 머지 차단 |
| main 머지 후 | 풀 회귀 + Docker 이미지 빌드 검증 | 알람 (deploy 시작 전) |
| Postman 컬렉션 갱신 | Newman + 통합 전수 | 머지 차단 |
| 마이그레이션 추가 | 통합 + 마이그레이션 멱등성 테스트 | 머지 차단 |
| 의존성 메이저 업그레이드 | 풀 회귀 + 수동 검수 | 머지 차단 |
