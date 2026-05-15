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

# feat-lint-format-husky — Implementation Plan

## 변경 이력

| Version | Date | Author | Change |
|---|---|---|---|
| v0.1 | 2026-05-15 | yongtae.cho@bespinglobal.com | 초안 |

## 1. 커밋 시퀀스 (DAG)

| # | 커밋 | 영향 파일 | 테스트 추가 | 회귀 위험 |
|---|---|---|---|---|
| 1 | `chore(infra): ESLint·Prettier 설정 (#2)` | `.eslintrc.cjs`, `.eslintignore`, `.prettierrc`, `.prettierignore` | (정적 — 본 PR에서 실 lint 실행) | 낮음 |
| 2 | `chore(infra): husky + lint-staged + 패키지 lint 스크립트 (#2)` | `.husky/pre-commit`, `.lintstagedrc.json`, 루트·3패키지 `package.json` 갱신 | (정적) | 낮음 — devDeps 추가 |

## 2. 의존성 그래프

```
#1 (.eslintrc + .prettierrc 룰셋 결정)
  └──▶ #2 (husky + lint-staged 명령이 #1 룰셋 호출)
```

- Blocked-by: 없음.
- #1 머지 #1 → ISS-CI-01 입력.

## 3. 테스트 매핑

| 커밋 | 테스트 추가 위치 | 시나리오 |
|---|---|---|
| #1 | (없음) | 정적 검증 — `.eslintrc.cjs` JS syntax + `.prettierrc` JSON syntax |
| #2 | (없음 — pre-commit 자체가 검증) | 사용자 환경에서 `git commit`에 의도적 위반 1줄로 hook 차단 확인 (acceptance §1 AC-02) |

본 이슈는 인프라 chore. 코드 line 0 — 커버리지 면제.

## 4. 빌드·실행 검증 단계

```bash
# 정적 검증
node -e "require('./.eslintrc.cjs')"
python3 -c "import json; json.load(open('.prettierrc'))"
python3 -c "import json; json.load(open('.lintstagedrc.json'))"
test -x .husky/pre-commit

# 사용자 환경
pnpm install                          # husky 자동 설치 (prepare hook)
./devkit lint                         # exit 0 (기존 코드는 깨끗)
echo "const x: any = 1" > backend/src/_violation.ts
git add backend/src/_violation.ts
git commit -m "test"                  # 거부 예상 (no-explicit-any)
git restore --staged backend/src/_violation.ts && rm backend/src/_violation.ts
```

## 5. 점진 합의 / 결정 발생 항목

- ADR 작성 필요: no — 11-conventions §5 결정 적용.
- 결정 변경 잠재 항목: ESLint 9 flat config로 전환 시 ADR (현재 .eslintrc.cjs legacy).
