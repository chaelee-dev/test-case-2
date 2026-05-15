---
doc_type: feature-risk
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

# feat-prisma-schema — Feature Risk

## 변경 이력

| Version | Date | Author | Change |
|---|---|---|---|
| v0.1 | 2026-05-15 | yongtae.cho@bespinglobal.com | 초안 |

## 1. 본 변경의 리스크

| RISK-ID | 제목 | 영향(1~5) | 가능성(1~5) | 등급 |
|---|---|---|---|---|
| F-RISK-01 | SQLite·PostgreSQL provider 차이 — 일부 컬럼 타입 호환성 | 3 | 2 | M |
| F-RISK-02 | cascade onDelete가 의도와 다르게 동작 — 데이터 손실 | 4 | 2 | M |

## 2. 리스크 상세

### F-RISK-01: provider 호환성

- 카테고리: 호환성
- 트리거 신호: SQLite는 boolean 미지원·datetime 정밀도 차이.
- 완화 전략: schema에서 Int(0/1)·DateTime 표준 사용. provider 차이는 마이그레이션 시점에 prisma가 흡수.
- 검증 방법: AC-01.

### F-RISK-02: cascade 의도와 다른 동작

- 카테고리: 데이터 영속성
- 트리거 신호: Article 삭제 시 Comment·Favorite·ArticleTag 동시 삭제. User 삭제는 cascade 안 함 (Article author 보존 정책 — RealWorld 사양 미명시, brief OQ-D2 추후).
- 완화 전략: schema에 명시적 onDelete: Cascade. 후속 통합 테스트로 검증.
- 검증 방법: 후속 ISS-BE-ART-* 통합 테스트.

## 3. High 등급 단계적 롤아웃

(High 없음)

## 4. 데이터 영속성 변경

- 본 이슈가 DB schema 최초 생성. 이후 schema 변경은 별도 마이그레이션 + ADR.
- Rollback: `git revert` + 로컬 DB 삭제 가능 (sprint 1, 사용자 데이터 0).

## 5. 15-risk.md 갱신 항목

(없음)
