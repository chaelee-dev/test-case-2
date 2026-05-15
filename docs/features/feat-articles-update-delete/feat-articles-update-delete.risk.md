---
doc_type: feature-risk
version: v0.1
status: Draft
author: yongtae.cho@bespinglobal.com
date: 2026-05-15
gate: feature
related:
  R-ID: [R-F-10, R-F-11]
  F-ID: [F-05]
  supersedes: null
---

# feat-articles-update-delete — Feature Risk

## 변경 이력

| Version | Date | Author | Change |
|---|---|---|---|
| v0.1 | 2026-05-15 | yongtae.cho@bespinglobal.com | 초안 |

## 1. 본 변경의 리스크

| RISK-ID | 제목 | 영향(1~5) | 가능성(1~5) | 등급 |
|---|---|---|---|---|
| F-RISK-01 | DELETE cascade로 의도치 않은 데이터 손실 | 5 | 2 | M |
| F-RISK-02 | 권한 검증 누락 → IDOR (Insecure Direct Object Reference) | 5 | 1 | M |

## 2. 리스크 상세

### F-RISK-01: DELETE cascade

- 카테고리: 데이터 영속성
- 완화: schema에 onDelete 명시. 단위 테스트로 cascade 동작 확인.
- 검증: AC-05.

### F-RISK-02: IDOR

- 카테고리: 보안
- 완화: articleService.update/remove에서 authorId === viewerId 검증. 미통과 시 ForbiddenError 403.
- 검증: AC-03·AC-06.

## 3. High 등급 단계적 롤아웃

(없음)

## 4. 데이터 영속성 변경

- DELETE — cascade 동작. 본 PR 머지 후 DELETE 호출 시 Comment·Favorite·ArticleTag 동시 삭제.

## 5. 15-risk.md 갱신 항목

(없음)
