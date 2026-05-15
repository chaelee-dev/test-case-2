---
doc_type: feature-brief
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

# feat-newman-ci — Feature Brief

## 변경 이력

| Version | Date | Author | Change |
|---|---|---|---|
| v0.1 | 2026-05-15 | yongtae.cho@bespinglobal.com | 초안 |

## 1. 한 줄 의도

RealWorld 공식 Postman 컬렉션 + newman runner. 후속 ISS-CI-01 BLOCKED 해소 후 CI 통합.

## 2. 사용자 가치

R-N-01 (RealWorld API 적합도) 회귀 자동화.

## 3. 현재 상태 → 변경 후 상태

| 측면 | 현재 | 변경 후 |
|---|---|---|
| Postman 컬렉션 | 없음 | `e2e/newman/conduit.postman_collection.json` placeholder |
| Newman runner | placeholder script | `e2e/newman/run.ts` 실 runner |

## 4. 모드 자동 감지 결과

- mode: add
- 근거: ADR-0032 규칙 4 (type:chore)

## 5. 영향 범위

신규: e2e/newman/conduit.postman_collection.json, e2e/newman/run.ts, e2e/package.json scripts:test:newman 실 runner로 교체, README.

## 6. 비목표

- .github/workflows/ci.yml 갱신 — #3 BLOCKED 해소 후 별도 follow-up
- RealWorld 공식 사양 23 케이스 전수 — 본 PR은 골격 + placeholder 케이스 1개

## 7. Open Questions

- O-1: 공식 컬렉션 URL: https://github.com/gothinkster/realworld/tree/main/api → 본 PR에서는 placeholder (전수 추가는 사용자가 fetch 후 commit)
