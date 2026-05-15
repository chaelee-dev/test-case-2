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

# feat-ci-baseline — Acceptance Criteria

## 변경 이력

| Version | Date | Author | Change |
|---|---|---|---|
| v0.1 | 2026-05-15 | yongtae.cho@bespinglobal.com | 초안 |

## 1. 인수 기준 (Given/When/Then)

### AC-01: 템플릿 YAML 파싱

- Given `docs/planning/operations/ci-workflow-template.yml`
- When `yq '.'`
- Then exit 0 + 4 job 키
- 측정: 자동
- R-ID: R-N-04

### AC-02: 사용자 활성화 안내 명확

- Given PR body
- When 사용자 읽음
- Then `gh auth refresh -s workflow` + cp + push 4-line 절차 명시
- 측정: 수동
- R-ID: R-N-04

### AC-03: 활성화 후 CI 자동 트리거

- Given 활성화 완료
- When 후속 PR 생성
- Then 4 job 모두 자동 실행
- 측정: 자동 (활성화 후)
- R-ID: R-N-04

## 2. Definition of Done (D-06)

- [ ] yq 정적 검증
- [ ] AI 게이트 정적
- [ ] Test Plan 4블록
- [ ] tested 라벨 P14
- [ ] Approve 1
- [ ] CI green N/A (CI 자체 도입, 활성화 후 실증)

## 3. 비기능 인수

- 활성화 후 CI ≤10분.

## 4. 회귀 인수

- 활성화 후 모든 후속 PR이 4 job 통과.
