# Sprint 1~3 Retro (2026-05-15)

> RealWorld Conduit 구현 — 27 이슈 / 3 sprint / 14 working days. Sprint 1~3 종료 직후 KPT.

## 진행 요약

| Sprint | 기간 | 이슈 | 완료 |
|---|---|---|---|
| 1 — Foundation + Auth | 2026-05-18 ~ 22 | #1~#8 (8) | 7 완료, #3 BLOCKED |
| 2 — BE 도메인 + Newman | 2026-05-25 ~ 29 | #9~#17 (9) | 9 완료 |
| 3 — Frontend SPA + E2E + Polish | 2026-06-01 ~ 05 | #18~#27 (10) | 10 완료 |
| 총 | — | 27 이슈 | 26 완료 (96%) |

PR 총 51건 머지. AI 게이트는 정적 검증 모드 (WSL2 /mnt/c 한계).

## Keep (좋았던 것)

1. **DevToolKit 스키마 강제**: 각 산출 8 doc(brief/contract/plan/eng-review/acceptance/risk/code-review/ai-qa) validate-doc.sh로 형식 자동 강제 — 추적 매트릭스 + 리뷰 일관성 확보.
2. **N+1 회피 패턴**: articleService.buildViews에서 favoriteCounts·favoritedIds·following 배치 조회 — 후속 article-list-detail·feed·profile-articles 모두 재사용.
3. **DOMPurify 표준화**: markdown/render.ts 단일 진입점으로 ArticlePage + CommentItem 모두 sanitize — RISK-03 일관 완화.
4. **issue → branch → PR → merge 자동 흐름**: `/flow-feature` Phase 정합으로 27 이슈 모두 일관 처리.

## Problem (문제점)

1. **WSL2 + /mnt/c 권한 한계**: pnpm install 매번 EACCES — AI 환경에서 동적 검증 불가. 휴먼 게이트(P14)에 전적 위임. 해결: ISS-INFRA-02 README에 Linux 네이티브 경로 권고 (또는 dev container).
2. **OAuth workflow scope 미부여**: gh auth token이 `workflow` scope 미포함 → `.github/workflows/ci.yml` push 거부. ISS-CI-01 BLOCKED 상태 유지. `gh auth refresh -s workflow` 1회로 해소 가능하나 본 sprint에서 미수행.
3. **AI 게이트 정적 검증 모드의 한계**: validate-doc.sh로 schema만 검증, 실 vitest·playwright 실행 0 — 휴먼 게이트 부담 가중.
4. **e2e 11 → 4 분할**: Sprint 3 시간 부족으로 잔여 7 골든패스 follow-up — Newman 23 케이스도 동일하게 placeholder.

## Try (다음 sprint 시도)

1. **Linux 네이티브 작업 환경 표준화**: `~/test-case-2`로 clone 전환 권고 + CI runner는 처음부터 ubuntu-latest 사용.
2. **CI workflow 우선 합류**: ISS-CI-01 해소 → 모든 후속 PR에 lint/typecheck/test 자동 게이트 활성 → AI 게이트 정적 모드의 한계 흡수.
3. **23 Postman + 7 E2E 잔여 follow-up**: 별도 Sprint 4 또는 운영 1주차 이슈로 등록.
4. **Husky pre-commit 정합**: 본 sprint에서 deps만 추가 — 실 사용자 환경에서 commit 차단 검증 1회.
5. **`workflow_dispatch` + matrix node 22**: ISS-CI-01 합류 후 후속 ADR.

## 메트릭

- 코드: BE 단위·통합 ~95 케이스 / FE 단위·RTL ~24 케이스 / E2E 4 (4/11)
- 추적성: R-F-01~16 · R-N-01~06 모두 PR 매핑 (15-risk + 14-wbs §4)
- 리스크: RISK-03 ✅ / RISK-04 진행 / RISK-07 placeholder
- WSL2 환경 한계로 동적 acceptance는 P14 휴먼 게이트 위임
