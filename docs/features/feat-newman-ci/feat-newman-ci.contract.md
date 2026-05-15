---
doc_type: feature-contract
version: v0.1
status: Draft
author: yongtae.cho@bespinglobal.com
date: 2026-05-15
gate: feature
related:
  R-ID: [R-N-01]
  F-ID: []
  supersedes: null
---

# feat-newman-ci — Change Contract

## 변경 이력

| Version | Date | Author | Change |
|---|---|---|---|
| v0.1 | 2026-05-15 | yongtae.cho@bespinglobal.com | 초안 |

## 0. 참조 정본 ID (Referenced-IDs)

| 종류 | 정본 위치 | 영향 ID |
|---|---|---|
| R-ID (요구) | `docs/planning/04-srs/04-srs.md` | R-N-01 (Postman/Newman PASS) |
| F-ID (기능) | `docs/planning/05-prd/05-prd.md` | (none) |
| 영향 모듈 | `docs/planning/07-hld/07-hld.md` | (none — 회귀 인프라) |
| 영향 엔드포인트 | `docs/planning/09-lld-api-spec/09-lld-api-spec.md` | 전 19 엔드포인트 (newman target) |
| 적용 컨벤션 절 | `docs/planning/13-test-design/03-regression.md` | §3 회귀 자동화 |

## 1. 변경 의도

Postman 컬렉션 사본 + newman runner. CI 통합은 후속.

## 2. Before / After

| 항목 | Before | After |
|---|---|---|
| e2e/newman/conduit.postman_collection.json | 없음 (.gitkeep) | placeholder Postman v2.1 컬렉션 (health check 1건) |
| e2e/newman/run.ts | 없음 | newman.run() 호출 + 결과 콘솔 출력 |
| e2e/newman/README.md | 없음 | 갱신 절차 |
| e2e/package.json scripts.test:newman | echo stub | `tsx newman/run.ts` |

## 3. 호출자·의존자 (Call Sites)

| 위치 | 영향 | 조치 |
|---|---|---|
| `./devkit e2e` | newman 실행 가능 (BE running 시) | 사용자 검증 |
| ISS-CI-01 (BLOCKED) | newman job이 본 컬렉션 사용 | 후속 |

## 4. Backward Compatibility

- Breaking: no.

## 5. Rollback 전략

- revert 가능: yes.

## 6. 비목표

- 공식 23 케이스 전수 — 별도 follow-up
- CI workflow 갱신 — ISS-CI-01 해소 후
