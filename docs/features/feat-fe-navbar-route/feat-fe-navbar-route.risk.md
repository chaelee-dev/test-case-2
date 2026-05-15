---
doc_type: feature-risk
version: v0.1
status: Draft
author: yongtae.cho@bespinglobal.com
date: 2026-05-15
gate: feature
related:
  R-ID: []
  F-ID: [F-11]
  supersedes: null
---

# feat-fe-navbar-route — Feature Risk

## 변경 이력

| Version | Date | Author | Change |
|---|---|---|---|
| v0.1 | 2026-05-15 | yongtae.cho@bespinglobal.com | 초안 |

## 1. 본 변경의 리스크

| RISK-ID | 제목 | 영향(1~5) | 가능성(1~5) | 등급 |
|---|---|---|---|---|
| F-RISK-01 | RootLayout 도입으로 기존 라우트 동작 변경 | 2 | 2 | L |

## 2. 리스크 상세

### F-RISK-01

- 카테고리: 호환성
- 완화: 기존 모든 라우트가 RootLayout의 child가 되도록 routes.tsx 재구성.

## 3. High 등급 단계적 롤아웃

(없음)

## 4. 데이터 영속성 변경

(없음)

## 5. 15-risk.md 갱신 항목

(없음)
