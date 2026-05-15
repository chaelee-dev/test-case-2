---
doc_type: feature-risk
version: v0.1
status: Draft
author: yongtae.cho@bespinglobal.com
date: 2026-05-15
gate: feature
related:
  R-ID: [R-F-08]
  F-ID: [F-06]
  supersedes: null
---

# feat-fe-article — Feature Risk

## 변경 이력

| Version | Date | Author | Change |
|---|---|---|---|
| v0.1 | 2026-05-15 | yongtae.cho@bespinglobal.com | 초안 |

## 1. 본 변경의 리스크

| RISK-ID | 제목 | 영향(1~5) | 가능성(1~5) | 등급 |
|---|---|---|---|---|
| F-RISK-01 | XSS — sanitizer bypass | 5 | 3 | H |

## 2. 리스크 상세

### F-RISK-01: XSS bypass

- 카테고리: 보안
- 완화: DOMPurify ALLOWED_TAGS 화이트리스트 + 단위 테스트 7가지. 15-risk RISK-03 직접.
- 검증: AC-02·03·04.

## 3. High 등급 단계적 롤아웃

- RISK-03이 High 등급. 단 본 PR은 sanitizer 도입 자체이므로 단계적 롤아웃은 불필요 (롤백 시 마크다운 렌더 비활성 → 사용자 경험 영향).

## 4. 데이터 영속성 변경

(없음)

## 5. 15-risk.md 갱신 항목

- RISK-03 완화 완료 — 본 PR 머지 후 §3 진행 표에 ✅.
