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

# feat-fe-init — Feature Risk

## 변경 이력

| Version | Date | Author | Change |
|---|---|---|---|
| v0.1 | 2026-05-15 | yongtae.cho@bespinglobal.com | 초안 |

## 1. 본 변경의 리스크

| RISK-ID | 제목 | 영향(1~5) | 가능성(1~5) | 등급 |
|---|---|---|---|---|
| F-RISK-01 | localStorage token — XSS 시 노출 | 4 | 2 | M |

## 2. 리스크 상세

### F-RISK-01: localStorage XSS

- 카테고리: 보안
- 완화: DOMPurify로 마크다운 sanitize (#21). CSP는 추후 운영.
- 검증: #21 sanitizer 통합 테스트.

## 3. High 등급 단계적 롤아웃

(없음)

## 4. 데이터 영속성 변경

(localStorage)

## 5. 15-risk.md 갱신 항목

(RISK-03 연계)
