---
doc_type: feature-eng-review
version: v0.1
status: Draft
author: yongtae.cho@bespinglobal.com
date: 2026-05-15
gate: feature
related:
  R-ID: [R-N-05]
  F-ID: []
  supersedes: null
---

# feat-prisma-schema — Engineering Review

## 변경 이력

| Version | Date | Author | Change |
|---|---|---|---|
| v0.1 | 2026-05-15 | yongtae.cho@bespinglobal.com | 초안 |

## 0. Verdict

- verdict: PASS
- reviewer: yongtae.cho@bespinglobal.com
- review_at: 2026-05-15

## 1. Contract 검토

§0 5행 완비. §2 7 항목 04 §5 정합.

## 2. Plan 검토

3 커밋 DAG. seed 멱등 — upsert.

## 3. UX 검토

N/A.

## 4. 6단계 폴더링 충족

`docs/features/feat-prisma-schema/` ✅.

## 5. frontmatter / Manifest 검증

R-ID [R-N-05]. doc_type 8종 OK.

## 6. 발견 사항 (3축 OX)

| Q | 답 | 처리 |
|---|---|---|
| Q1: 5 entity (User·Article·Tag·Comment + join ArticleTag·Favorite·Follow) 모두? | O | schema.prisma model 매핑 |
| Q2: UNIQUE 제약 (username/email/slug/tag.name)? | O | @unique |
| Q3: cascade onDelete? | O | Article→Comment·Favorite·ArticleTag cascade |
| Q4: 인덱스 (R-N-05)? | O | author_id·created_at desc·tag list |
| Q5: SQLite·PostgreSQL 양방? | O | datasource provider = sqlite (dev), postgresql (prod) 환경별 |

## 7. NEEDS-WORK 항목

(없음)
