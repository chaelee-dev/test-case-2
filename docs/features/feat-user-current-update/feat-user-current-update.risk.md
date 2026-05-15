---
doc_type: feature-risk
version: v0.1
status: Draft
author: yongtae.cho@bespinglobal.com
date: 2026-05-15
gate: feature
related:
  R-ID: [R-F-03]
  F-ID: [F-01, F-02]
  supersedes: null
---

# feat-user-current-update — Feature Risk

## 변경 이력

| Version | Date | Author | Change |
|---|---|---|---|
| v0.1 | 2026-05-15 | yongtae.cho@bespinglobal.com | 초안 |

## 1. 본 변경의 리스크

| RISK-ID | 제목 | 영향(1~5) | 가능성(1~5) | 등급 |
|---|---|---|---|---|
| F-RISK-01 | mass assignment — 화이트리스트 미흡으로 id/role 변경 가능 | 4 | 3 | M |
| F-RISK-02 | password 빈 문자열 의미 모호 | 2 | 2 | L |

## 2. 리스크 상세

### F-RISK-01: mass assignment

- 카테고리: 보안
- 트리거: PUT body에 `id`·`createdAt` 등 포함.
- 완화: pickUserBody 화이트리스트 — bio·image·email·username·password만.
- 검증: AC-04.

### F-RISK-02: password 빈 문자열

- 카테고리: 호환성
- 완화: 빈 문자열·undefined = 미변경 (OQ-D3 결정).
- 검증: AC-06.

## 3. High 등급 단계적 롤아웃

(High 없음)

## 4. 데이터 영속성 변경

(스키마 변경 없음 — UPDATE만)

## 5. 15-risk.md 갱신 항목

(없음)
