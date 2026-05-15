---
doc_type: feature-risk
version: v0.1
status: Draft
author: yongtae.cho@bespinglobal.com
date: 2026-05-15
gate: feature
related:
  R-ID: [R-F-09, R-F-10, R-F-11]
  F-ID: [F-05]
  supersedes: null
---

# feat-fe-editor — Feature Risk

## 변경 이력

| Version | Date | Author | Change |
|---|---|---|---|
| v0.1 | 2026-05-15 | yongtae.cho@bespinglobal.com | 초안 |

## 1. 본 변경의 리스크

| RISK-ID | 제목 | 영향(1~5) | 가능성(1~5) | 등급 |
|---|---|---|---|---|
| F-RISK-01 | delete 우발 클릭 — 데이터 손실 | 4 | 3 | M |

## 2. 리스크 상세

### F-RISK-01: delete 우발

- 카테고리: 데이터 영속성
- 완화: window.confirm 다이얼로그.
- 검증: AC-05.

## 3. High 등급 단계적 롤아웃

(없음)

## 4. 데이터 영속성 변경

- DELETE — cascade (BE schema).

## 5. 15-risk.md 갱신 항목

(없음)
