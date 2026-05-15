---
doc_type: feature-risk
version: v0.1
status: Draft
author: yongtae.cho@bespinglobal.com
date: 2026-05-15
gate: feature
related:
  R-ID: [R-F-09]
  F-ID: [F-05]
  supersedes: null
---

# feat-articles-create — Feature Risk

## 변경 이력

| Version | Date | Author | Change |
|---|---|---|---|
| v0.1 | 2026-05-15 | yongtae.cho@bespinglobal.com | 초안 |

## 1. 본 변경의 리스크

| RISK-ID | 제목 | 영향(1~5) | 가능성(1~5) | 등급 |
|---|---|---|---|---|
| F-RISK-01 | slug 충돌 → 동시성 race condition | 3 | 2 | L |
| F-RISK-02 | tagList 빈 문자열 / 중복 | 2 | 3 | L |

## 2. 리스크 상세

### F-RISK-01: slug race

- 카테고리: 데이터 영속성
- 완화: insert 시 UNIQUE 위반 catch → suffix 재시도 (최대 3회).
- 검증: AC-05.

### F-RISK-02: tagList 정리

- 카테고리: 호환성
- 완화: ensureTags가 trim/filter/Set으로 정리.
- 검증: AC-04.

## 3. High 등급 단계적 롤아웃

(없음)

## 4. 데이터 영속성 변경

- INSERT만. 스키마 변경 없음.

## 5. 15-risk.md 갱신 항목

(없음)
