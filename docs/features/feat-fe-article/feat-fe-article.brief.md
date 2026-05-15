---
doc_type: feature-brief
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

# feat-fe-article — Feature Brief

## 변경 이력

| Version | Date | Author | Change |
|---|---|---|---|
| v0.1 | 2026-05-15 | yongtae.cho@bespinglobal.com | 초안 |

## 1. 한 줄 의도

ArticlePage + marked + DOMPurify (XSS sanitize). RISK-03 완화 정본.

## 2. 사용자 가치

글 상세 + 안전한 렌더.

## 3. 현재 상태 → 변경 후 상태

| 측면 | 현재 | 변경 후 |
|---|---|---|
| ArticlePage | placeholder | 실 article 렌더 + 마크다운 |
| Markdown sanitize | 없음 | marked + DOMPurify |

## 4. 모드 자동 감지 결과

- mode: add
- 근거: ADR-0032 규칙 4 (type:feature)

## 5. 영향 범위

신규: markdown/render.ts·purifyConfig.ts, ArticlePage, 단위 테스트 (XSS 핵심).

## 6. 비목표

- Comments → #24.
- Edit → #22.

## 7. Open Questions

(없음)
