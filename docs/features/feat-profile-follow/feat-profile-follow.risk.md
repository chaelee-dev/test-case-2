---
doc_type: feature-risk
version: v0.1
status: Draft
author: yongtae.cho@bespinglobal.com
date: 2026-05-15
gate: feature
related:
  R-ID: [R-F-04, R-F-05]
  F-ID: [F-02, F-08]
  supersedes: null
---

# feat-profile-follow — Feature Risk

## 변경 이력

| Version | Date | Author | Change |
|---|---|---|---|
| v0.1 | 2026-05-15 | yongtae.cho@bespinglobal.com | 초안 |

## 1. 본 변경의 리스크

| RISK-ID | 제목 | 영향(1~5) | 가능성(1~5) | 등급 |
|---|---|---|---|---|
| F-RISK-01 | self-follow 미차단 → 데이터 일관성 영향 | 2 | 3 | L |
| F-RISK-02 | optionalAuth 누락으로 GET following 항상 false | 3 | 2 | M |

## 2. 리스크 상세

### F-RISK-01: self-follow 미차단

- 카테고리: 호환성
- 완화: userService.follow에서 followerId === followeeId 시 ValidationError throw.
- 검증: AC-05.

### F-RISK-02: optionalAuth 누락

- 카테고리: 호환성
- 완화: GET 라우트에 optionalAuth 미들웨어 명시.
- 검증: AC-01.

## 3. High 등급 단계적 롤아웃

(없음)

## 4. 데이터 영속성 변경

(스키마 변경 없음)

## 5. 15-risk.md 갱신 항목

(없음)
