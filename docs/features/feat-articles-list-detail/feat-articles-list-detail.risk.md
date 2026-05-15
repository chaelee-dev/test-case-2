---
doc_type: feature-risk
version: v0.1
status: Draft
author: yongtae.cho@bespinglobal.com
date: 2026-05-15
gate: feature
related:
  R-ID: [R-F-06, R-F-08]
  F-ID: [F-03, F-06]
  supersedes: null
---

# feat-articles-list-detail — Feature Risk

## 변경 이력

| Version | Date | Author | Change |
|---|---|---|---|
| v0.1 | 2026-05-15 | yongtae.cho@bespinglobal.com | 초안 |

## 1. 본 변경의 리스크

| RISK-ID | 제목 | 영향(1~5) | 가능성(1~5) | 등급 |
|---|---|---|---|---|
| F-RISK-01 | N+1 쿼리 — 매 article마다 author/tags/favorites 조회 | 4 | 3 | M |
| F-RISK-02 | limit·offset 음수 → SQL 오류 | 2 | 3 | L |

## 2. 리스크 상세

### F-RISK-01: N+1 쿼리

- 카테고리: 성능
- 완화: include로 author·tags 한 번에 조회 + favoriteCounts는 별도 groupBy.
- 검증: 비기능 인수 200ms.

### F-RISK-02: limit/offset 음수

- 카테고리: 호환성
- 완화: zod 검증 — limit >=1 + offset >=0.
- 검증: AC-03.

## 3. High 등급 단계적 롤아웃

(없음)

## 4. 데이터 영속성 변경

(없음)

## 5. 15-risk.md 갱신 항목

(없음)
