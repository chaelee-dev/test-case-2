---
doc_type: test-design
version: v0.1 (Draft)
status: Draft
author: yongtae.cho@bespinglobal.com
date: 2026-05-15
gate: C
related:
  R-ID: [R-F-01, R-F-02, R-F-03, R-F-04, R-F-05, R-F-06, R-F-07, R-F-08, R-F-09, R-F-10, R-F-11, R-F-12, R-F-13, R-F-14, R-F-15, R-F-16, R-F-17, R-F-18, R-F-19, R-N-01, R-N-02, R-N-03, R-N-04, R-N-05, R-N-06]
  F-ID: [F-01, F-02, F-03, F-04, F-05, F-06, F-07, F-08, F-09, F-10, F-11]
  supersedes: null
---

# 02-catalog Test Scenario Catalog (단위·통합·E2E 별 묶음) — test-design

<!-- ADR-0036: 레벨 그룹핑. §1=단위 / §2=통합 / §3=E2E / §4=매트릭스.
     ADR-0034: 각 ### R-/F- subsection은 "출처" + "테스트 레벨" BLOCK. -->

## 변경 이력

| Version | Date | Author | Change |
|---|---|---|---|
| v0.1 | 2026-05-15 | yongtae.cho@bespinglobal.com | 초안 — 04 R-F·R-N + 05 F-ID fan-in |

## 1. 단위 테스트 카탈로그

> 단위 = 함수·클래스·React 컴포넌트 격리 테스트. 외부 의존(DB·네트워크) msw·mock으로 차단.

### R-F-01: 회원가입 단위

- **출처**: 04#R-F-01 (회원가입)
- **테스트 레벨**: 단위
- 테스트:
  - `userService.register()` — username/email 정규식 + bcrypt 호출 검증 (mock).
  - 이메일 형식 위반 시 `ValidationError` throw.
  - 비밀번호 해싱 함수 — bcrypt cost=12, 동일 입력 다른 출력.

### R-F-02: 로그인 단위

- **출처**: 04#R-F-02 (로그인)
- **테스트 레벨**: 단위
- 테스트:
  - `userService.login()` — bcrypt.compare mock + JwtService.sign 호출 검증.
  - 잘못된 password → 422 `email or password is invalid`.
  - 미가입 email도 동일 메시지 (사용자 존재성 비노출).

### R-F-09: 글 작성 단위 (slug 생성기)

- **출처**: 04#R-F-09 (글 작성)
- **테스트 레벨**: 단위
- 테스트:
  - `generateSlug(title, exists?)` — kebab-case 변환, 동일 title 2회 시 hash suffix.
  - `ArticleService.create()` — tag dedup, partial-update 화이트리스트.
  - title/description/body 빈 값 → `ValidationError`.

### R-F-12: 즐겨찾기 토글 단위

- **출처**: 04#R-F-12 (즐겨찾기)
- **테스트 레벨**: 단위
- 테스트:
  - `ArticleService.favorite/unfavorite()` — FavoriteRepo mock 호출 검증 + idempotency(중복 POST는 동일 결과).

### R-F-17: FE 라우팅 가드 단위

- **출처**: 04#R-F-17 (FE 라우팅)
- **테스트 레벨**: 단위
- 테스트:
  - `protectedRoute.tsx` (RTL) — 익명 진입 시 `/login?returnUrl=<원래 경로>` 리다이렉트.
  - 로그인 성공 후 returnUrl로 복귀.

### R-F-18: 마크다운 sanitizer 단위

- **출처**: 04#R-F-18 (마크다운 렌더)
- **테스트 레벨**: 단위
- 테스트:
  - `renderMarkdown('<script>alert(1)</script>')` 결과에 `<script>` 미포함.
  - `**bold**` → `<strong>bold</strong>`.
  - `[link](javascript:...)` → `javascript:` 스킴 제거.

### R-N-02: JWT 단위

- **출처**: 04#R-N-02 (인증/세션 보안)
- **테스트 레벨**: 단위
- 테스트:
  - `JwtService.sign/verify` — exp=24h, 만료 토큰 → throw.
  - Bearer prefix 입력 → AuthMiddleware에서 거절.

### R-N-03: ErrorMapper 단위

- **출처**: 04#R-N-03 (표준 오류 응답)
- **테스트 레벨**: 단위
- 테스트:
  - `ValidationError("title","can't be empty")` → 422 `{"errors":{"title":["can't be empty"]}}`.
  - `UnauthorizedError` → 401, `ForbiddenError` → 403, `NotFoundError` → 404.

### R-N-04: Prisma 무결성 단위 (schema 검사)

- **출처**: 04#R-N-04 (데이터 무결성)
- **테스트 레벨**: 단위
- 테스트:
  - `schema.prisma`의 unique 제약 검증(SQL 생성물 inspection).
  - cascade 옵션 명시 — Article ↔ Comment/Favorite/ArticleTag.

## 2. 통합 테스트 카탈로그

> 통합 = Express 앱 + 실 SQLite + supertest. Service ↔ Repo ↔ DB 경로 검증.

### R-F-03: 현재 사용자 통합

- **출처**: 04#R-F-03 (현재 사용자 조회·갱신)
- **테스트 레벨**: 통합
- 테스트:
  - `GET /api/user` 유효/만료 JWT 케이스.
  - `PUT /api/user` 부분 갱신 + 중복 email 422 + JWT 없음 401.

### R-F-05: 팔로우 통합

- **출처**: 04#R-F-05 (팔로우/언팔로우)
- **테스트 레벨**: 통합
- 테스트:
  - POST/DELETE 토글 → GET profile의 following 정합.
  - self-follow → 422.
  - 미존재 username → 404.

### R-F-06: 글 필터 통합

- **출처**: 04#R-F-06 (글 목록 필터)
- **테스트 레벨**: 통합
- 테스트:
  - `?tag=foo` / `?author=user` / `?favorited=user` 각각 정확 필터.
  - `limit=999` → 422.
  - 정렬 createdAt DESC.

### R-F-07: Your Feed 통합

- **출처**: 04#R-F-07 (Your Feed)
- **테스트 레벨**: 통합
- 테스트:
  - 팔로우 0건 → 빈 배열.
  - 팔로우 추가 후 즉시 포함.
  - 무인증 → 401.

### R-F-10: 글 수정 통합

- **출처**: 04#R-F-10 (글 수정)
- **테스트 레벨**: 통합
- 테스트:
  - 본인 글 PUT → 200, title 변경 시 slug 재생성.
  - 타인 글 PUT → 403.
  - 미존재 slug → 404.

### R-F-11: 글 삭제 cascade 통합

- **출처**: 04#R-F-11 (글 삭제)
- **테스트 레벨**: 통합
- 테스트:
  - 본인 글 DELETE → 후속 GET 404 + Comment·Favorite·ArticleTag 자식 행 0.
  - 타인 글 DELETE → 403.

### R-F-14: 댓글 작성 통합

- **출처**: 04#R-F-14 (댓글 작성)
- **테스트 레벨**: 통합
- 테스트:
  - POST → GET 목록에 포함.
  - 빈 body → 422.
  - 미존재 slug → 404.

### R-F-16: 태그 통합

- **출처**: 04#R-F-16 (태그 목록)
- **테스트 레벨**: 통합
- 테스트:
  - 글 0건 시 빈 배열.
  - 글 N건의 태그 중복 제거 후 반환.

### R-N-01: RealWorld 사양 적합 통합 (Newman)

- **출처**: 04#R-N-01 (표준 RealWorld 사양 적합도)
- **테스트 레벨**: 통합
- 테스트:
  - CI job: seed DB → `newman run conduit.postman_collection.json` → 23 케이스 PASS.
  - 어떤 1건이라도 실패 → 머지 차단.

## 3. E2E 테스트 카탈로그

> E2E = 실 브라우저(Playwright) + 실 BE + 실 DB. 사용자 골든패스 검증.

### F-01: 인증 골든패스 E2E

- **출처**: 05#F-01 (인증)
- **테스트 레벨**: E2E
- 시나리오:
  - `/register` → 가입 → 헤더에 username 노출 → 새 탭에서 `/login` → 동일 자격증명 로그인 OK.
  - 만료 JWT 보호 페이지 진입 → `/login?returnUrl=...` 리다이렉트.

### F-02: 프로필 갱신 E2E

- **출처**: 05#F-02 (사용자 프로필)
- **테스트 레벨**: E2E
- 시나리오:
  - `/settings`에서 bio 변경 → 글 카드 저자 정보 갱신 검증.
  - 타인 email로 변경 시도 → 422 ErrorList 표시.

### F-03: Home Global Feed + Tag 필터 E2E

- **출처**: 05#F-03 (글 발견)
- **테스트 레벨**: E2E
- 시나리오:
  - 익명 사용자 Home → Global Feed 탭 자동 활성 → 태그 클릭 → `#tag` 필터 적용 → 페이지네이션 1→2.

### F-04: Your Feed E2E

- **출처**: 05#F-04 (Your Feed)
- **테스트 레벨**: E2E
- 시나리오:
  - A 사용자 로그인 → `/profile/B` Follow → B가 글 작성 → A의 Home Your Feed에 즉시 표시.

### F-05: Editor 라이프사이클 E2E

- **출처**: 05#F-05 (글 작성·수정·삭제)
- **테스트 레벨**: E2E
- 시나리오:
  - `/editor`에서 Publish → `/article/:slug` 이동 → Edit → 저장 → Delete → 홈 이동 + 글 목록 사라짐.

### F-06: 글 상세 + 마크다운 XSS 방어 E2E

- **출처**: 05#F-06 (글 상세 + 마크다운)
- **테스트 레벨**: E2E
- 시나리오:
  - 글 작성 시 body에 `<script>alert(1)</script>` 입력 → 상세 페이지에서 alert 미발생, raw `<script>` 미렌더.
  - `**bold**` → 굵게 표시.

### F-07: 즐겨찾기 E2E

- **출처**: 05#F-07 (즐겨찾기)
- **테스트 레벨**: E2E
- 시나리오:
  - Home 글 카드 ❤ 클릭 → 카운트 +1 → 다시 → -1.
  - 익명 ❤ 클릭 → `/login` 이동.

### F-08: 팔로우 E2E

- **출처**: 05#F-08 (팔로우)
- **테스트 레벨**: E2E
- 시나리오:
  - `/profile/B`에서 Follow → 버튼 상태 변경 → 본인 자신 프로필에 Follow 버튼 비노출.

### F-09: 댓글 E2E

- **출처**: 05#F-09 (댓글)
- **테스트 레벨**: E2E
- 시나리오:
  - 본인 댓글 작성·삭제 골든패스.
  - 타인 댓글에는 휴지통 버튼 비노출.

### F-10: 태그 카탈로그 E2E

- **출처**: 05#F-10 (태그 카탈로그)
- **테스트 레벨**: E2E
- 시나리오:
  - Home 사이드바 Popular Tags 렌더 → 클릭 시 필터 적용.

### F-11: 보호 라우트 returnUrl E2E

- **출처**: 05#F-11 (FE 라우팅·보호 라우트)
- **테스트 레벨**: E2E
- 시나리오:
  - 익명에서 `/settings` 진입 → `/login?returnUrl=/settings` → 로그인 → `/settings` 복귀.
  - 익명에서 ❤ 클릭 → `/login?returnUrl=<원래 경로>`.

### R-N-06: 접근성 키보드 내비 E2E

- **출처**: 04#R-N-06 (접근성·브라우저 지원)
- **테스트 레벨**: E2E
- 시나리오:
  - Home → Sign In(키보드만 Tab/Enter) → /editor → Publish 완주.

## 4. 레벨 매트릭스 (단위·통합·E2E)

> 04 SRS·05 PRD의 3축 결정을 통합한 마스터 매트릭스. `❌`(미작성) 금지 — `✅` 또는 `N/A`.

| ID (출처) | 단위 | 통합 | E2E | 비고 |
|---|---|---|---|---|
| R-F-01 (04 SRS) | ✅ | ✅ | ✅ | 가입 |
| R-F-02 (04 SRS) | ✅ | ✅ | ✅ | 로그인 |
| R-F-03 (04 SRS) | ✅ | ✅ | ✅ | 현재 사용자 |
| R-F-04 (04 SRS) | ✅ | ✅ | ✅ | 프로필 조회 |
| R-F-05 (04 SRS) | ✅ | ✅ | ✅ | 팔로우/언팔로우 |
| R-F-06 (04 SRS) | ✅ | ✅ | ✅ | 글 목록 필터 |
| R-F-07 (04 SRS) | ✅ | ✅ | ✅ | Your Feed |
| R-F-08 (04 SRS) | ✅ | ✅ | ✅ | 글 상세 |
| R-F-09 (04 SRS) | ✅ | ✅ | ✅ | 글 작성 |
| R-F-10 (04 SRS) | ✅ | ✅ | ✅ | 글 수정 |
| R-F-11 (04 SRS) | ✅ | ✅ | ✅ | 글 삭제 cascade |
| R-F-12 (04 SRS) | ✅ | ✅ | ✅ | 즐겨찾기 |
| R-F-13 (04 SRS) | ✅ | ✅ | ✅ | 댓글 목록 |
| R-F-14 (04 SRS) | ✅ | ✅ | ✅ | 댓글 작성 |
| R-F-15 (04 SRS) | ✅ | ✅ | ✅ | 댓글 삭제 |
| R-F-16 (04 SRS) | ✅ | ✅ | ✅ | 태그 |
| R-F-17 (04 SRS) | ✅ | N/A | ✅ | FE 라우팅 — BE 미관여 |
| R-F-18 (04 SRS) | ✅ | N/A | ✅ | 마크다운 — BE 미관여 |
| R-F-19 (04 SRS) | ✅ | N/A | ✅ | 페이지네이션 UI — BE 미관여 |
| R-N-01 (04 SRS) | N/A | ✅ | N/A | Newman 회귀 (외부 도구) |
| R-N-02 (04 SRS) | ✅ | ✅ | ✅ | JWT 보안 |
| R-N-03 (04 SRS) | ✅ | ✅ | N/A | 오류 응답 형식 (BE 통합으로 충분) |
| R-N-04 (04 SRS) | ✅ | ✅ | N/A | 무결성 (BE 통합) |
| R-N-05 (04 SRS) | N/A | ✅ | N/A | 성능 SLO (k6 운영 단계 deferral 가능) |
| R-N-06 (04 SRS) | N/A | N/A | ✅ | 접근성 키보드 |
| F-01 (05 PRD) | ✅ | ✅ | ✅ | 인증 |
| F-02 (05 PRD) | ✅ | ✅ | ✅ | 프로필 |
| F-03 (05 PRD) | ✅ | ✅ | ✅ | Home Global Feed |
| F-04 (05 PRD) | ✅ | ✅ | ✅ | Your Feed |
| F-05 (05 PRD) | ✅ | ✅ | ✅ | Editor |
| F-06 (05 PRD) | ✅ | ✅ | ✅ | Article + Markdown |
| F-07 (05 PRD) | ✅ | ✅ | ✅ | Favorite |
| F-08 (05 PRD) | ✅ | ✅ | ✅ | Follow |
| F-09 (05 PRD) | ✅ | ✅ | ✅ | Comment |
| F-10 (05 PRD) | ✅ | ✅ | ✅ | Tag catalog |
| F-11 (05 PRD) | ✅ | N/A | ✅ | 라우팅 — BE 미관여 |
