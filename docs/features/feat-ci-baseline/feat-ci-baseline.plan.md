---
doc_type: feature-plan
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

# feat-ci-baseline — Implementation Plan

## 변경 이력

| Version | Date | Author | Change |
|---|---|---|---|
| v0.1 | 2026-05-15 | yongtae.cho@bespinglobal.com | 초안 |

## 1. 커밋 시퀀스 (DAG)

| # | 커밋 | 영향 파일 | 테스트 추가 | 회귀 위험 |
|---|---|---|---|---|
| 1 | `chore(infra): CI workflow 템플릿 + 활성화 안내 (#3)` | docs/planning/operations + docs/features | (정적 YAML lint) | 낮음 |

## 2. 의존성 그래프

```
#1 단일
```

Blocked-by: 없음. ISS-INFRA-02 머지됨.

## 3. 테스트 매핑

| 커밋 | 테스트 추가 위치 | 시나리오 |
|---|---|---|
| #1 | (정적) | yq YAML 파싱 |

## 4. 빌드·실행 검증 단계

```bash
yq '.' docs/planning/operations/ci-workflow-template.yml > /dev/null

# 사용자 1회 활성화:
gh auth refresh -s workflow
cp docs/planning/operations/ci-workflow-template.yml .github/workflows/ci.yml
git add .github/workflows/ci.yml
git commit -m "chore(infra): activate CI workflow (#3)"
git push
```

## 5. 점진 합의 / 결정 발생 항목

- ADR: no.
- 잠재: 추후 OAuth scope 자동 처리 자동화 — 별도 ADR.
