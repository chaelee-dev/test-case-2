---
doc_type: feature-brief
version: v0.1
status: Draft
author: yongtae.cho@bespinglobal.com
date: 2026-05-15
gate: feature
related:
  R-ID: [R-F-09, R-F-10, R-F-11]
  F-ID: [F-05]
  supersedes: null
---

# feat-fe-editor — Feature Brief

## 변경 이력

| Version | Date | Author | Change |
|---|---|---|---|
| v0.1 | 2026-05-15 | yongtae.cho@bespinglobal.com | 초안 |

## 1. 한 줄 의도

EditorPage Create + Edit (/editor와 /editor/:slug) + ArticlePage에 Delete 버튼.

## 2. 사용자 가치

본인 글 작성·수정·삭제.

## 3. 현재 상태 → 변경 후 상태

| 측면 | 현재 | 변경 후 |
|---|---|---|
| EditorPage | placeholder | 실 폼 (title/description/body/tagList) |
| /editor/:slug | placeholder | 기존 article 로드 후 PUT |
| ArticlePage delete | 없음 | 작성자만 |

## 4. 모드 자동 감지 결과

- mode: add
- 근거: ADR-0032 규칙 4 (type:feature)

## 5. 영향 범위

신규: EditorPage 실 구현, ArticlePage에 delete 버튼 추가.

## 6. 비목표

(없음)

## 7. Open Questions

(없음)
