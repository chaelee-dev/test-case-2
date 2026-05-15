---
doc_type: test-design
version: v0.1 (Draft)
status: Draft
author: yongtae.cho@bespinglobal.com
date: 2026-05-15
gate: C
related:
  R-ID: []
  F-ID: []
  supersedes: null
---

# 05-delivery-format Customer Delivery Format — test-design

<!-- ADR-0034 BLOCK: §3 ID 채번 + §4 전달 시점. -->

## 변경 이력

| Version | Date | Author | Change |
|---|---|---|---|
| v0.1 | 2026-05-15 | yongtae.cho@bespinglobal.com | 초안 — TC-/IT-/E2E- 채번 + 스프린트 종료 시 전달 |

## 1. 산출 범위 (단위·통합·E2E 시나리오)

- **포함**:
  - 02-catalog §1 단위 카탈로그 → `TC-UT-*` ID.
  - 02-catalog §2 통합 카탈로그 → `IT-*` ID + Newman 23 케이스.
  - 02-catalog §3 E2E 카탈로그 → `E2E-*` ID.
  - 04-performance §2 보안 시나리오(F-06 XSS, R-N-02 JWT 위조 등) → `SEC-*` ID.
  - 04-performance §1 부하 결과(수행 시) → `PERF-*` ID + p50/p95/p99 표.
- **제외**:
  - 내부 lint/typecheck 결과(품질 메타지표는 별도 보고).
  - 시각 회귀(없음, 운영 단계 deferral).
  - 코드 커버리지 리포트는 첨부(부속 자료)로만 — 정본 산출은 아님.

## 2. 포맷·도구 (HTML/XLSX/Allure 등)

- **단위·통합 리포트**: Vitest `--reporter=html` → HTML 1세트(`coverage/index.html` + 시나리오 트리).
- **E2E 리포트**: Playwright HTML 리포트(`playwright-report/`) — 실패 케이스 trace·screenshot 포함.
- **API 적합 리포트**: Newman `--reporters html,cli,json` → `newman-report.html`.
- **요약 (고객 1장)**: 본 sub-file의 ID 채번에 따른 XLSX 1장 — 행: 시나리오 ID, 열: 카테고리·R-/F- 매핑·결과·환경·일자.
- **보안 리포트**: `SEC-*` 시나리오 결과를 §1 XLSX에 통합 행으로 포함. 별도 보고서 미작성(고객 요청 시 운영 단계 deferral).
- **부하 리포트**: k6 JSON → 그래프 캡처 PNG 첨부(수행 시). 본 MVP는 수행 안 함.

## 3. 시나리오 ID 채번 규칙

- **prefix 규약**:
  - `TC-UT-NNN` — 단위(UT = Unit Test).
  - `IT-NNN` — 통합(Integration). Newman 케이스는 `IT-NWMN-NNN`.
  - `E2E-NNN` — E2E 골든패스.
  - `SEC-NNN` — 보안 시나리오(XSS, JWT 위조 등).
  - `PERF-NNN` — 부하 측정(수행 시).
  - `UC-NN` — 사용자 시나리오(03 user-scenarios 정본 ID와 동일, fan-in 보조).
- **번호 채번**:
  - 각 prefix별 연속 3자리 zero-padded (`001`부터).
  - 카탈로그(02-catalog) 추가 시 다음 번호 부여, 재사용 금지.
  - 삭제된 케이스의 번호도 재사용 금지(deprecation log에 남김).
- **매핑 의무**: 각 ID 행에 반드시 출처 R-ID 또는 F-ID 인용 (예: `TC-UT-007 → R-F-09 slug 생성기`).
- **본 sub-file의 prefix 정의**는 13-test-design 폴더의 정본 — 02-catalog 갱신 시 본 §3에 prefix 신설/변경을 함께 기록.

## 4. 전달 시점 (스프린트 종료·릴리스·고객 요청)

- **스프린트 종료 시 (정기)**: 각 sprint(14 WBS 기준) 마지막 working day에 §1 산출 1세트 + 요약 XLSX 1장. 고객/이해관계자 메일 또는 GitHub Release notes 첨부.
- **릴리스 시 (MVP / 운영 진입)**: 풀세트 — 단위·통합·E2E·Newman·보안. 부하는 수행한 경우만.
- **고객 요청 시 (ad-hoc)**: 본 sub-file의 채번 + 포맷에 맞춰 최신 회귀 결과를 4 working hours 내 추출 가능해야 함. CI 아티팩트가 영속 보관(≥ 90일)되어야 함.
- **자동화 진입점**: `./devkit e2e && pnpm -r test --reporter=html` → 위 세 리포트 폴더가 일관 위치에 생성. 별도 스크립트로 XLSX 요약 변환은 운영 단계 도입.
