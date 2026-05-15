---
doc_type: feature-risk
version: v0.1
status: Draft
author: yongtae.cho@bespinglobal.com
date: 2026-05-15
gate: feature
related:
  R-ID: [R-N-04]
  F-ID: []
  supersedes: null
---

# feat-ci-baseline — Feature Risk

## 변경 이력

| Version | Date | Author | Change |
|---|---|---|---|
| v0.1 | 2026-05-15 | yongtae.cho@bespinglobal.com | 초안 |

## 1. 본 변경의 리스크

| RISK-ID | 제목 | 영향(1~5) | 가능성(1~5) | 등급 |
|---|---|---|---|---|
| F-RISK-01 | 사용자가 활성화 안 함 — CI 영구 미작동 | 3 | 4 | M |
| F-RISK-02 | 첫 활성화 시 기존 코드 lint·test 실패 | 3 | 3 | M |

## 2. 리스크 상세

### F-RISK-01: 활성화 누락

- 카테고리: 운영
- 완화: PR body에 명시적 4-line 절차. retro 회고에도 언급.

### F-RISK-02: 첫 활성화 실패

- 카테고리: 호환성
- 완화: pnpm-lock.yaml 없으면 frozen-lockfile 실패 — 첫 push 전 `pnpm install` 1회 권고.

## 3. High 등급 단계적 롤아웃

(없음)

## 4. 데이터 영속성 변경

(없음)

## 5. 15-risk.md 갱신 항목

(없음)
