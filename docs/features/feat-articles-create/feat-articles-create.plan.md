---
doc_type: feature-plan
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

# feat-articles-create — Implementation Plan

## 변경 이력

| Version | Date | Author | Change |
|---|---|---|---|
| v0.1 | 2026-05-15 | yongtae.cho@bespinglobal.com | 초안 |

## 1. 커밋 시퀀스 (DAG)

| # | 커밋 | 영향 파일 | 테스트 추가 | 회귀 위험 |
|---|---|---|---|---|
| 1 | `feat(backend): util/slug.ts (#11)` | util/slug.ts, slug.test.ts | unit 5 | 낮음 |
| 2 | `feat(backend): articleService.create + POST /api/articles (#11)` | articleRepo.create, articleService.create, routes/articles, articles.integration | integration 5 | 중간 |

## 2. 의존성 그래프

```
#1 → #2
```

Blocked-by: 없음 (ART-01 머지됨).

## 3. 테스트 매핑

| 커밋 | 테스트 추가 위치 | 시나리오 |
|---|---|---|
| #1 | slug.test.ts | 한글/특수문자/공백/충돌 시 suffix |
| #2 | articles.create.integration.test.ts | POST 정상 + body 반환 / 빈 title 422 / tagList 2개 / 인증 401 / 슬러그 충돌 자동 suffix |

## 4. 빌드·실행 검증 단계

```bash
./devkit test backend
curl -X POST -H "Authorization: Token <jwt>" -H "Content-Type: application/json" \
  -d '{"article":{"title":"Hello","description":"d","body":"b","tagList":["x","y"]}}' \
  localhost:3000/api/articles
```

## 5. 점진 합의 / 결정 발생 항목

- ADR: no.
