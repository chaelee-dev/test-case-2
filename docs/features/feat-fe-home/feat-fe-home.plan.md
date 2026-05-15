---
doc_type: feature-plan
version: v0.1
status: Draft
author: yongtae.cho@bespinglobal.com
date: 2026-05-15
gate: feature
related:
  R-ID: [R-F-06, R-F-07, R-F-16]
  F-ID: [F-03, F-04, F-10]
  supersedes: null
---

# feat-fe-home — Implementation Plan

## 변경 이력

| Version | Date | Author | Change |
|---|---|---|---|
| v0.1 | 2026-05-15 | yongtae.cho@bespinglobal.com | 초안 |

## 1. 커밋 시퀀스 (DAG)

| # | 커밋 | 영향 파일 | 테스트 추가 | 회귀 위험 |
|---|---|---|---|---|
| 1 | `feat(frontend): articles·tags endpoints + ArticleCard·FeedTabs·Pagination·TagList (#20)` | api/endpoints/*, components/* | unit 4 | 중간 |
| 2 | `feat(frontend): HomePage 실 피드 (#20)` | pages/HomePage | unit 2 | 중간 |

## 2. 의존성 그래프

```
#1 → #2
```

Blocked-by: #18 (apiClient).

## 3. 테스트 매핑

| 커밋 | 테스트 추가 위치 | 시나리오 |
|---|---|---|
| #1 | ArticleCard.test.tsx | favorited 상태 / tagList 렌더 |
| #2 | HomePage.test.tsx | global tab 렌더 + pagination |

## 4. 빌드·실행 검증 단계

```bash
./devkit test frontend
./devkit dev frontend
```

## 5. 점진 합의 / 결정 발생 항목

- ADR: no.
