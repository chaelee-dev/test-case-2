---
doc_type: index
version: v0.1
status: Draft
author: yongtae.cho@bespinglobal.com
date: 2026-05-15
gate: operations
related:
  R-ID: []
  F-ID: []
  supersedes: null
---

# 15-risk — Index

> 본 폴더는 1수준 산출 `15-risk` (ADR-0015 §2.1 전수 폴더 구조). 폴더 내 메인 파일·분할 sub 파일 목록.

<!-- gen-index.sh가 폴더 내 .md를 자동 스캔하여 갱신. 수동 작성한 "한 줄 요약"은 보존. -->

| 파일 | 한 줄 요약 |
|---|---|
| [15-risk.md](15-risk.md) | RealWorld Conduit 11 리스크 (외부 의존·보안·일정·운영·기술) — High 3건(XSS, JWT/secret, 사양 적합도) 단계적 롤아웃 |

## 정합
- 정본 schema: `.claude/schemas/risk.schema.yaml`
- 게이트: operations
- 폴더 구조: [ADR-0015](../adr/0015-mandatory-folder-structure-and-test-coverage.md)
- 입력: 01·02·14 WBS (리스크 매핑 §5)
- 출력: → /flow-bootstrap (WBS와 함께 sprint-bootstrap에 컨텍스트 제공)
