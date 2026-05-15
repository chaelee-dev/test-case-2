---
doc_type: feature-risk
version: v0.1
status: Draft
author: yongtae.cho@bespinglobal.com
date: 2026-05-15
gate: feature
related:
  R-ID: [R-F-13, R-F-14, R-F-15]
  F-ID: [F-09]
  supersedes: null
---

# feat-comments-crud — Feature Risk

## 변경 이력

| Version | Date | Author | Change |
|---|---|---|---|
| v0.1 | 2026-05-15 | yongtae.cho@bespinglobal.com | 초안 |

## 1. 본 변경의 리스크

| RISK-ID | 제목 | 영향(1~5) | 가능성(1~5) | 등급 |
|---|---|---|---|---|
| F-RISK-01 | XSS — comment body가 마크다운/HTML 그대로 출력 | 5 | 3 | M |

## 2. 리스크 상세

### F-RISK-01: XSS in comment

- 카테고리: 보안
- 완화: BE는 raw 저장 (사양 충실). FE에서 DOMPurify로 sanitize. RISK-03 (15-risk) 정합.
- 검증: Sprint 3 FE XSS 테스트.

## 3. High 등급 단계적 롤아웃

(없음)

## 4. 데이터 영속성 변경

(스키마 변경 없음 — Comment INSERT/DELETE)

## 5. 15-risk.md 갱신 항목

(RISK-03 완화 — FE에서 완료 예정)
