---
doc_type: feature-acceptance
version: v0.1
status: Draft
author: yongtae.cho@bespinglobal.com
date: 2026-05-15
gate: feature
related:
  R-ID: [R-N-04]
  F-ID: []
  supersedes: null
---

# feat-ops-retro — Acceptance Criteria

## 변경 이력

| Version | Date | Author | Change |
|---|---|---|---|
| v0.1 | 2026-05-15 | yongtae.cho@bespinglobal.com | 초안 |

## 1. 인수 기준 (Given/When/Then)

### AC-01: retro doc 작성

- Given Sprint 1~3 진행 완료
- When retro 파일 작성
- Then KPT(Keep·Problem·Try) 항목 각 ≥3
- 측정: 수동
- R-ID: R-N-04

### AC-02: docker-compose runbook

- Given docker-compose.yml 산출
- When runbook 작성
- Then up/down/build/logs/troubleshooting 절 포함
- 측정: 수동
- R-ID: R-N-04

### AC-03: 15-risk RISK-03 완료 마크

- Given #21 머지로 DOMPurify 도입
- When 15-risk §3 갱신
- Then RISK-03 ✅
- 측정: 자동 (validate-doc.sh)
- R-ID: R-N-04

## 2. Definition of Done (D-06)

- [ ] retro doc
- [ ] runbook
- [ ] 15-risk 갱신
- [ ] AI 정적
- [ ] Test Plan 4블록
- [ ] tested 라벨 P14
- [ ] Approve 1
- [ ] CI green N/A

## 3. 비기능 인수

(없음)

## 4. 회귀 인수

- 기존 docs/planning 회귀.
