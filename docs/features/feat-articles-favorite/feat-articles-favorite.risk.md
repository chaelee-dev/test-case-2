---
doc_type: feature-risk
version: v0.1
status: Draft
author: yongtae.cho@bespinglobal.com
date: 2026-05-15
gate: feature
related:
  R-ID: [R-F-12]
  F-ID: [F-07]
  supersedes: null
---

# feat-articles-favorite — Feature Risk

## 변경 이력

| Version | Date | Author | Change |
|---|---|---|---|
| v0.1 | 2026-05-15 | yongtae.cho@bespinglobal.com | 초안 |

## 1. 본 변경의 리스크

| RISK-ID | 제목 | 영향(1~5) | 가능성(1~5) | 등급 |
|---|---|---|---|---|
| F-RISK-01 | favoritesCount 정확성 — count() 결과 timing | 2 | 2 | L |

## 2. 리스크 상세

### F-RISK-01: count 정확성

- 카테고리: 데이터 영속성
- 완화: upsert/delete 후 count() 별도 쿼리 — read-after-write 일관성 보장.

## 3. High 등급 단계적 롤아웃

(없음)

## 4. 데이터 영속성 변경

(스키마 변경 없음 — Favorite row insert/delete)

## 5. 15-risk.md 갱신 항목

(없음)
