---
doc_type: feature-brief
version: v0.1
status: Draft
author: yongtae.cho@bespinglobal.com
date: 2026-05-15
gate: feature
related:
  R-ID: [R-F-16]
  F-ID: [F-10]
  supersedes: null
---

# feat-tags-get — Feature Brief

## 변경 이력

| Version | Date | Author | Change |
|---|---|---|---|
| v0.1 | 2026-05-15 | yongtae.cho@bespinglobal.com | 초안 |

## 1. 한 줄 의도

GET /api/tags — 전체 태그 목록.

## 2. 사용자 가치

홈 사이드바의 인기 태그.

## 3. 현재 상태 → 변경 후 상태

| 측면 | 현재 | 변경 후 |
|---|---|---|
| GET /api/tags | 없음 | tagRepo.listAll 호출 + `{tags:[]}` |

## 4. 모드 자동 감지 결과

- mode: add
- 근거: ADR-0032 규칙 4 (type:feature)

## 5. 영향 범위

신규: routes/tags.ts, app mount, 통합 1.

## 6. 비목표

(없음)

## 7. Open Questions

(없음)
