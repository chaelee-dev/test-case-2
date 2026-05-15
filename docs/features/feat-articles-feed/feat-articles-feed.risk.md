---
doc_type: feature-risk
version: v0.1
status: Draft
author: yongtae.cho@bespinglobal.com
date: 2026-05-15
gate: feature
related:
  R-ID: [R-F-07]
  F-ID: [F-04]
  supersedes: null
---

# feat-articles-feed — Feature Risk

## 변경 이력

| Version | Date | Author | Change |
|---|---|---|---|
| v0.1 | 2026-05-15 | yongtae.cho@bespinglobal.com | 초안 |

## 1. 본 변경의 리스크

| RISK-ID | 제목 | 영향(1~5) | 가능성(1~5) | 등급 |
|---|---|---|---|---|
| F-RISK-01 | 라우터 순서 — /feed가 /:slug 뒤면 slug='feed'로 잘못 매칭 | 3 | 4 | M |
| F-RISK-02 | 팔로우 많은 사용자 — 대량 쿼리 | 3 | 2 | L |

## 2. 리스크 상세

### F-RISK-01: 라우터 순서

- 카테고리: 호환성
- 완화: routes/articles.ts에서 GET /feed를 GET /:slug 앞에 명시.
- 검증: AC-01.

### F-RISK-02: 대량 쿼리

- 카테고리: 성능
- 완화: limit/offset 강제. 후속 인덱스 추가.

## 3. High 등급 단계적 롤아웃

(없음)

## 4. 데이터 영속성 변경

(없음)

## 5. 15-risk.md 갱신 항목

(없음)
