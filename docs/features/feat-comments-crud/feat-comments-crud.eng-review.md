---
doc_type: feature-eng-review
version: v0.1
status: Draft
author: yongtae.cho@bespinglobal.com
date: 2026-05-15
gate: feature
related:
  R-ID: [R-F-13, R-F-14, R-F-15]
  F-ID: [F-09]
  supersedes: null
---

# feat-comments-crud — Engineering Review

## 변경 이력

| Version | Date | Author | Change |
|---|---|---|---|
| v0.1 | 2026-05-15 | yongtae.cho@bespinglobal.com | 초안 |

## 0. Verdict

- verdict: PASS
- reviewer: yongtae.cho@bespinglobal.com
- review_at: 2026-05-15

## 1. Contract 검토

§0 OK.

## 2. Plan 검토

1 커밋.

## 3. UX 검토

N/A.

## 4. 6단계 폴더링 충족

✅.

## 5. frontmatter / Manifest 검증

R-F-13·14·15, F-09.

## 6. 발견 사항 (3축 OX)

| Q | 답 | 처리 |
|---|---|---|
| Q1: 빈 body 422? | O | ValidationError |
| Q2: 작성자 OR 글 작성자 삭제? | O | service 검증 |
| Q3: 404 시 article vs comment 메시지 구분? | O | article 우선 |

## 7. NEEDS-WORK 항목

(없음)
