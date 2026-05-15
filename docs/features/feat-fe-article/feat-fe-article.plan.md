---
doc_type: feature-plan
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

# feat-fe-article — Implementation Plan

## 변경 이력

| Version | Date | Author | Change |
|---|---|---|---|
| v0.1 | 2026-05-15 | yongtae.cho@bespinglobal.com | 초안 |

## 1. 커밋 시퀀스 (DAG)

| # | 커밋 | 영향 파일 | 테스트 추가 | 회귀 위험 |
|---|---|---|---|---|
| 1 | `feat(frontend): markdown sanitizer (marked + DOMPurify) (#21)` | markdown/* + deps + unit | unit 6 (XSS 7가지) | 중간 — 보안 |
| 2 | `feat(frontend): ArticlePage (#21)` | pages/ArticlePage | RTL 2 | 중간 |

## 2. 의존성 그래프

```
#1 → #2
```

Blocked-by: 없음.

## 3. 테스트 매핑

| 커밋 | 테스트 추가 위치 | 시나리오 |
|---|---|---|
| #1 | markdown.test.ts | <script> 제거 / onerror= 제거 / javascript: href 제거 / <iframe> 제거 / safe HTML 유지 / markdown→HTML |
| #2 | ArticlePage.test.tsx | render + sanitized body |

## 4. 빌드·실행 검증 단계

```bash
./devkit test frontend
./devkit dev frontend
# /article/<slug>
```

## 5. 점진 합의 / 결정 발생 항목

- ADR: no — 보안 표준.
