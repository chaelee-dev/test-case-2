---
doc_type: feature-risk
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

# feat-lint-format-husky — Feature Risk

## 변경 이력

| Version | Date | Author | Change |
|---|---|---|---|
| v0.1 | 2026-05-15 | yongtae.cho@bespinglobal.com | 초안 |

## 1. 본 변경의 리스크

| RISK-ID | 제목 | 영향(1~5) | 가능성(1~5) | 등급 |
|---|---|---|---|---|
| F-RISK-01 | ESLint 룰셋이 기존 코드와 충돌 → 첫 commit 차단 | 2 | 3 | L |
| F-RISK-02 | husky pre-commit이 다른 OS(특히 Windows)에서 권한 문제 | 2 | 2 | L |

## 2. 리스크 상세

### F-RISK-01: ESLint 룰셋 충돌

- 카테고리: 호환성
- 트리거 신호: `./devkit lint`가 기존 코드에서 위반 검출.
- 완화 전략: 본 이슈 PR에서 `./devkit lint --fix` 1회 실행 후 잔여 위반은 코드 수정으로 흡수. 다만 본 환경에서는 `pnpm install` 자체가 안 되므로 사용자 휴먼 게이트에서 1회 실행.
- 검증 방법: AC-01.

### F-RISK-02: husky cross-OS

- 카테고리: 호환성
- 트리거 신호: Windows git에서 `.husky/pre-commit` 실행 권한 부재.
- 완화 전략: husky v9는 자동 chmod +x. `prepare` script가 `pnpm install` 시 1회 실행.
- 검증 방법: 휴먼 게이트 — Windows 환경 1회 git commit 시도.

## 3. High 등급 단계적 롤아웃

(High 없음 — 단계적 롤아웃 불필요)

## 4. 데이터 영속성 변경

(없음)

## 5. 15-risk.md 갱신 항목

(추가 없음)
