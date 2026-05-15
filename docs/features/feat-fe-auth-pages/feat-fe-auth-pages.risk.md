---
doc_type: feature-risk
version: v0.1
status: Draft
author: yongtae.cho@bespinglobal.com
date: 2026-05-15
gate: feature
related:
  R-ID: [R-F-01, R-F-02]
  F-ID: [F-01]
  supersedes: null
---

# feat-fe-auth-pages — Feature Risk

## 변경 이력

| Version | Date | Author | Change |
|---|---|---|---|
| v0.1 | 2026-05-15 | yongtae.cho@bespinglobal.com | 초안 |

## 1. 본 변경의 리스크

| RISK-ID | 제목 | 영향(1~5) | 가능성(1~5) | 등급 |
|---|---|---|---|---|
| F-RISK-01 | password 평문 console.log 노출 | 4 | 1 | L |

## 2. 리스크 상세

### F-RISK-01: password 노출

- 카테고리: 보안
- 완화: 코드 리뷰 + ESLint no-console rule.

## 3. High 등급 단계적 롤아웃

(없음)

## 4. 데이터 영속성 변경

(없음)

## 5. 15-risk.md 갱신 항목

(없음)
