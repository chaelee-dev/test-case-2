---
doc_type: wbs
version: v0.1 (Draft)
status: Draft
author: yongtae.cho@bespinglobal.com
date: 2026-05-15
gate: operations
related:
  R-ID: [R-F-01, R-F-02, R-F-03, R-F-04, R-F-05, R-F-06, R-F-07, R-F-08, R-F-09, R-F-10, R-F-11, R-F-12, R-F-13, R-F-14, R-F-15, R-F-16, R-F-17, R-F-18, R-F-19, R-N-01, R-N-02, R-N-03, R-N-04, R-N-05, R-N-06]
  F-ID: [F-01, F-02, F-03, F-04, F-05, F-06, F-07, F-08, F-09, F-10, F-11]
  supersedes: null
---

# Conduit (RealWorld) — WBS

<!-- /flow-wbs Phase 3/4 산출. /flow-bootstrap의 sprint-bootstrap.sh 입력. -->

## 변경 이력

| Version | Date | Author | Change |
|---|---|---|---|
| v0.1 | 2026-05-15 | yongtae.cho@bespinglobal.com | 초안 — 3 sprint × 27 issue. R-ID·F-ID 100% 매핑 |

## 0. 개요

- **목표**: 3 스프린트(약 15~18 working days, 1 FTE) 내 RealWorld Conduit MVP 출시. 19 BE 엔드포인트 + 7 FE 라우트 + Newman 100% + E2E 골든패스.
- **스프린트 구조**:
  - **Sprint 1** — Foundation + Auth + UserService (BE 기반).
  - **Sprint 2** — Articles·Comments·Favorites·Tags·Newman CI.
  - **Sprint 3** — Frontend SPA + E2E + Docker compose + Retro.
- **이슈 단위**: 0.5d / 1d / 2d / 3d (ADR-0008 §2.3 정합).
- **각 이슈 8필드 강제**: 유형·영역·우선순위·Estimated Effort·Acceptance Criteria·Contract Before·Contract After·DoD Checklist.
- **DAG**: 모든 의존성은 “이전 sprint 산출 → 다음 sprint 소비”. 동일 sprint 내 의존성은 §3 참조.
- **추적성**: SRS R-F-01~19 + R-N-01~06 + PRD F-01~11이 모두 1개 이상 이슈에 매핑됨 (§4).

## 1. 스프린트 일람

| Sprint | 기간 | 목표(Outcome) | 주요 R-ID/F-ID | 이슈 수 |
|---|---|---|---|---|
| Sprint 1 | 2026-05-18 ~ 2026-05-22 (5d) | 모노레포·CI 부트스트랩 + 인증(가입·로그인·세션) + 사용자 갱신. Postman job 골격 준비. | R-F-01·R-F-02·R-F-03·R-N-02·R-N-03·R-N-04 (인증 베이스). F-01·F-02 부분. | 8 |
| Sprint 2 | 2026-05-25 ~ 2026-05-29 (5d) | BE 도메인 완성: 프로필·팔로우·글 CRUD·feed·즐겨찾기·댓글·태그. Newman 23 케이스 PASS. | R-F-04~R-F-16, R-F-19, R-N-01. F-03·F-04·F-07·F-08·F-09·F-10 (BE 측). | 9 |
| Sprint 3 | 2026-06-01 ~ 2026-06-05 (5d) | FE SPA 7 라우트 + 마크다운 sanitizer + E2E 골든패스 + Docker compose 검증 + retro. | R-F-17·R-F-18·R-N-05·R-N-06. F-01~F-11 모두 (FE 측). | 10 |

> **Open**: 14 WBS는 1 FTE 가정으로 약 17.5 working days 분량. 3 sprint(15d) 안에 들어가려면 일부 0.5d 이슈를 짝짓거나 외부 RealWorld FE 상호운용성 KPI를 운영 단계로 deferral 필요 (RISK-10, OQ-W1).

## 2. 스프린트 상세

### Sprint 1 — Foundation + Auth (2026-05-18 ~ 2026-05-22)

> Goal: 인증 핵심 도메인 + CI 기반. Sprint 2의 시작점.

##### Issue: ISS-INFRA-01 — 모노레포·devkit·docker-compose 부트스트랩

- 유형: chore
- 영역: infra
- 우선순위: P0
- Estimated Effort: 1d
- Acceptance Criteria: Given 빈 저장소 When `pnpm install && ./devkit dev backend` 실행 Then `:3000`에서 health check 응답 + `./devkit dev frontend`로 `:5173` Vite 부팅.
- Contract Before: 12-scaffolding §1 디렉토리 트리 + §5 빌드 명령
- Contract After: `pnpm-workspace.yaml`·`tsconfig.base.json`·`devkit`·`devtoolkit.config.yaml`·`docker-compose.yml` 커밋. `./devkit help` 명령 정상.
- DoD Checklist: [ ] tree 매칭 [ ] devkit 명령 동작 [ ] docker compose dry-run 통과 [ ] PR 본문에 12-scaffolding 인용

##### Issue: ISS-INFRA-02 — ESLint·Prettier·Husky·lint-staged

- 유형: chore
- 영역: infra
- 우선순위: P0
- Estimated Effort: 0.5d
- Acceptance Criteria: Given dirty 변경 When `git commit` Then pre-commit hook이 lint-staged → eslint·prettier 자동 실행. 위반 시 commit 거부.
- Contract Before: 11-coding-conventions §5 Lint·포맷 표
- Contract After: 루트 `.eslintrc.cjs`·`.prettierrc`·`.husky/pre-commit`·각 패키지 `eslint` 스크립트.
- DoD Checklist: [ ] CI workflow에서 lint·typecheck job 통과 [ ] 임의 위반 1개로 hook 차단 확인

##### Issue: ISS-CI-01 — GitHub Actions baseline + Newman placeholder

- 유형: chore
- 영역: infra
- 우선순위: P0
- Estimated Effort: 0.5d
- Acceptance Criteria: Given PR open When CI run Then `lint`·`typecheck`·`test`·`newman(placeholder)` job 모두 실행. Newman은 빈 컬렉션이라도 0건 PASS로 통과.
- Contract Before: 13-test-design/03-regression §2 자동화 정책
- Contract After: `.github/workflows/ci.yml`. matrix: ubuntu-latest, node 20.
- DoD Checklist: [ ] PR open 시 CI 실행 [ ] 각 job 로그 확인 [ ] Newman job 골격 (Sprint 2에서 본 컬렉션 채움)

##### Issue: ISS-BE-INIT-01 — Express app + 미들웨어 + ErrorMapper

- 유형: feature
- 영역: backend
- 우선순위: P0
- Estimated Effort: 1d
- Acceptance Criteria: Given Express app boot When 임의 라우트가 ValidationError throw Then 422 + `{errors:{<field>:[msg]}}` 응답. UnauthorizedError → 401, NotFoundError → 404, ForbiddenError → 403.
- Contract Before: 07 HLD M-BE-HttpServer + M-BE-ErrorMapper. 09 §1 헤더 형식.
- Contract After: `backend/src/app.ts`·`server.ts`·`middleware/errorHandler.ts`·`errors/` 도메인 에러 클래스 5종.
- DoD Checklist: [ ] 단위 테스트 (ErrorMapper) [ ] 통합 테스트 (5 에러 케이스) [ ] traceId 로깅 [ ] CORS allow-list

##### Issue: ISS-BE-INIT-02 — Prisma schema + 마이그레이션 + seed

- 유형: feature
- 영역: backend
- 우선순위: P0
- Estimated Effort: 1d
- Acceptance Criteria: Given `schema.prisma` When `prisma migrate dev --name init` Then User·Article·Comment·Tag·Favorite·Follow 5 테이블 + 2 M:N 생성. seed로 사용자 2명·글 3건·태그 5건 초기화.
- Contract Before: 04 SRS §5 도메인 모델. 11-coding-conventions DB 컬럼 snake_case.
- Contract After: `backend/prisma/schema.prisma` + `migrations/` + `seed.ts`. `pnpm prisma:migrate` 명령.
- DoD Checklist: [ ] unique 제약 (username/email/slug) [ ] cascade 옵션 (Article→Comment·Favorite·ArticleTag) [ ] 인덱스 (R-N-05) [ ] seed 멱등

##### Issue: ISS-BE-AUTH-01 — JwtService + AuthMiddleware (Token 헤더 강제)

- 유형: feature
- 영역: backend
- 우선순위: P0
- Estimated Effort: 0.5d
- Acceptance Criteria: Given 보호 라우트 + `Authorization: Token <jwt>` 유효 When 호출 Then `req.user` 부착. 만료/Bearer/누락 시 401 (RISK-02·R-N-02).
- Contract Before: 07 HLD M-BE-JwtService + M-BE-AuthMiddleware. 11-coding-conventions §2 에러 prefix.
- Contract After: `backend/src/services/jwtService.ts` + `middleware/auth.ts`. 단위 테스트로 Bearer prefix 거절 확인.
- DoD Checklist: [ ] 단위 테스트 sign/verify [ ] 만료 토큰 케이스 [ ] Bearer 거절 케이스 [ ] env JWT_SECRET 검증

##### Issue: ISS-BE-USR-01 — UserService.register + login

- 유형: feature
- 영역: backend
- 우선순위: P0
- Estimated Effort: 1d
- Acceptance Criteria: Given 미가입 사용자 When `POST /api/users {user:{username,email,password}}` Then 200 + `{user:{token,email,username,bio:'',image:null}}`. Given 가입자 When `POST /api/users/login` 정확 자격증명 Then 200 + token. 잘못된 password → 422.
- Contract Before: 09 §3 `/api/users` + `/api/users/login`. 04 R-F-01·R-F-02.
- Contract After: `backend/src/services/userService.ts` register/login + `routes/users.ts`.
- DoD Checklist: [ ] 단위 (bcrypt cost=12) [ ] 통합 (supertest 가입→로그인) [ ] 중복 username/email 422 [ ] 잘못된 password 422 + 동일 메시지

##### Issue: ISS-BE-USR-02 — GET/PUT /api/user

- 유형: feature
- 영역: backend
- 우선순위: P0
- Estimated Effort: 0.5d
- Acceptance Criteria: Given 유효 JWT When `GET /api/user` Then 200 + 본인 user. `PUT /api/user {user:{bio?,email?,...}}` 부분 갱신 200. 만료 JWT → 401.
- Contract Before: 09 §3 `/api/user`. 04 R-F-03.
- Contract After: `userService.getCurrent` + `update` + `routes/users.ts` 추가.
- DoD Checklist: [ ] 부분 갱신 화이트리스트 [ ] email 중복 422 [ ] password 비움 시 미변경 (OQ-D3 정합)

---

### Sprint 2 — BE 도메인 + Newman (2026-05-25 ~ 2026-05-29)

> Goal: BE 19 엔드포인트 완성 + Newman 23 케이스 PASS.

##### Issue: ISS-BE-PRO-01 — Profile + Follow/Unfollow

- 유형: feature
- 영역: backend
- 우선순위: P0
- Estimated Effort: 1d
- Acceptance Criteria: Given 임의 사용자 When `GET /api/profiles/:username` Then 200 + `{profile:{...,following}}`. `POST/DELETE .../follow` 토글. 본인 자신 팔로우 422 (RISK-02).
- Contract Before: 09 §3 `/api/profiles/*`. 04 R-F-04·R-F-05.
- Contract After: `services/userService.ts` getProfile/follow/unfollow + `routes/profiles.ts`. FollowRepo.
- DoD Checklist: [ ] 단위 (self-follow 거절) [ ] 통합 (POST→GET following=true) [ ] 미존재 username 404 [ ] idempotency

##### Issue: ISS-BE-ART-01 — Articles 목록 + 상세 GET

- 유형: feature
- 영역: backend
- 우선순위: P0
- Estimated Effort: 1d
- Acceptance Criteria: Given 글 N건 When `GET /api/articles?tag&author&favorited&limit&offset` Then 200 + `{articles[], articlesCount}`. limit>100 → 422. `GET /api/articles/:slug` → 200 또는 404.
- Contract Before: 09 §3 `/api/articles`·`/api/articles/:slug`. 04 R-F-06·R-F-08.
- Contract After: `services/articleService.ts` list/get + `routes/articles.ts`. ArticleRepo·FavoriteRepo (count).
- DoD Checklist: [ ] 쿼리 파서 단위 [ ] 통합 (tag·author·favorited 조합) [ ] articlesCount 정확성 [ ] 정렬 createdAt DESC

##### Issue: ISS-BE-ART-02 — Articles POST + slug 생성기

- 유형: feature
- 영역: backend
- 우선순위: P0
- Estimated Effort: 1d
- Acceptance Criteria: Given 인증 사용자 When `POST /api/articles {article:{title,description,body,tagList?}}` Then 200 + article(slug 자동 생성). 충돌 시 hash suffix (RISK-05).
- Contract Before: 09 §3 `POST /api/articles`. 04 R-F-09. 11-coding-conventions slug 정책.
- Contract After: `articleService.create` + `util/slug.ts` + ArticleRepo.insert (트랜잭션 + Tag upsert + M:N).
- DoD Checklist: [ ] 단위 (slug 생성 + 충돌 suffix) [ ] 통합 (Tag M:N) [ ] title 빈 값 422 [ ] 트랜잭션 롤백 케이스

##### Issue: ISS-BE-ART-03 — Articles PUT + DELETE + cascade

- 유형: feature
- 영역: backend
- 우선순위: P0
- Estimated Effort: 1d
- Acceptance Criteria: Given 본인 글 When `PUT /api/articles/:slug` Then 200 + 갱신(title 변경 시 slug 재생성). `DELETE` Then 200 + 후속 GET 404 + 자식 행 0 (RISK-06).
- Contract Before: 09 §3. 04 R-F-10·R-F-11.
- Contract After: `articleService.update/delete` + 권한 가드.
- DoD Checklist: [ ] 단위 (권한 가드) [ ] 통합 (cascade 자식 행 0) [ ] 타인 글 403 [ ] 미존재 404 [ ] title 변경 시 slug 재생성

##### Issue: ISS-BE-ART-04 — Your Feed

- 유형: feature
- 영역: backend
- 우선순위: P0
- Estimated Effort: 0.5d
- Acceptance Criteria: Given 인증 사용자 + 팔로우 N건 When `GET /api/articles/feed` Then 200 + 팔로우 작가 글 only. 팔로우 0건 → 빈 배열.
- Contract Before: 09 §3 `/api/articles/feed`. 04 R-F-07.
- Contract After: `articleService.feed` + ArticleRepo `author_id IN (...)` 쿼리.
- DoD Checklist: [ ] 통합 (팔로우 추가 즉시 포함) [ ] 무인증 401 [ ] 정렬

##### Issue: ISS-BE-FAV-01 — Favorite POST/DELETE

- 유형: feature
- 영역: backend
- 우선순위: P0
- Estimated Effort: 0.5d
- Acceptance Criteria: Given 인증 사용자 When `POST .../favorite` Then 200 + favorited=true + count +1. idempotent. `DELETE`는 반대.
- Contract Before: 09 §3. 04 R-F-12.
- Contract After: `articleService.favorite/unfavorite` + FavoriteRepo (unique 복합키).
- DoD Checklist: [ ] 단위 (중복 POST idempotent) [ ] 통합 [ ] 미존재 slug 404

##### Issue: ISS-BE-CMT-01 — Comments CRUD

- 유형: feature
- 영역: backend
- 우선순위: P0
- Estimated Effort: 1d
- Acceptance Criteria: Given 인증 사용자 + Article When 댓글 작성·목록·삭제(본인만) Then 사양 응답. 빈 body 422. 타인 댓글 삭제 403.
- Contract Before: 09 §3 `/api/articles/:slug/comments[/:id]`. 04 R-F-13·14·15.
- Contract After: `services/commentService.ts` list/create/delete + `routes/comments.ts`. CommentRepo.
- DoD Checklist: [ ] 단위 (권한 가드) [ ] 통합 [ ] 본인 댓글만 삭제

##### Issue: ISS-BE-TAG-01 — Tags GET

- 유형: feature
- 영역: backend
- 우선순위: P1
- Estimated Effort: 0.5d
- Acceptance Criteria: Given 글 N건 When `GET /api/tags` Then 200 + `{tags:[...]}` (unique). 글 0건 → 빈 배열.
- Contract Before: 09 §3 `/api/tags`. 04 R-F-16.
- Contract After: `services/articleService.listTags()` + `routes/tags.ts` + TagRepo DISTINCT.
- DoD Checklist: [ ] 단위 [ ] 통합 (0건/N건)

##### Issue: ISS-OPS-02 — Newman CI + Postman 컬렉션 사본 + 23 케이스 PASS

- 유형: chore
- 영역: infra
- 우선순위: P0
- Estimated Effort: 1d
- Acceptance Criteria: Given CI PR When Newman job 실행 Then 23 케이스 전수 PASS + 1건 실패 시 머지 차단 (RISK-01·07, R-N-01).
- Contract Before: 13/03-regression §3 회귀 트리거. 04 R-N-01.
- Contract After: `e2e/newman/conduit.postman_collection.json` (RealWorld 공식 사본). `e2e/newman/run.ts`. `.github/workflows/ci.yml`에 newman job 본 컬렉션으로 교체.
- DoD Checklist: [ ] 23 케이스 PASS [ ] PR 차단 시뮬 [ ] 컬렉션 갱신 절차 README

---

### Sprint 3 — Frontend SPA + E2E + Polish (2026-06-01 ~ 2026-06-05)

> Goal: 7 라우트 + E2E 골든패스 + XSS 방어 + 운영 진입 준비.

##### Issue: ISS-FE-INIT-01 — Vite + RouterShell + AuthCtx + ApiClient

- 유형: feature
- 영역: frontend
- 우선순위: P0
- Estimated Effort: 1d
- Acceptance Criteria: Given Vite dev When `/login` 방문 Then 빈 폼 렌더. AuthCtx Provider + protectedRoute 가드 작동 (F-11). ApiClient는 `Token` 헤더 자동 부착.
- Contract Before: 07 HLD M-FE-RouterShell·AuthCtx·ApiClient. 12-scaffolding §1.
- Contract After: `frontend/src/main.tsx`·`App.tsx`·`router/`·`auth/`·`api/`.
- DoD Checklist: [ ] 단위 (AuthProvider) [ ] msw 모의로 api 테스트 [ ] 401 응답 → 토큰 클리어 + `/login`

##### Issue: ISS-FE-AUTH-01 — LoginPage + RegisterPage + ErrorList

- 유형: feature
- 영역: frontend
- 우선순위: P0
- Estimated Effort: 0.5d
- Acceptance Criteria: Given `/register` When 폼 submit Then 200 시 헤더에 username 노출 + 422 시 ErrorList. Login 동일.
- Contract Before: 10 §2 S-02·S-03. 05 F-01.
- Contract After: `pages/LoginPage.tsx`·`RegisterPage.tsx` + `components/ErrorList.tsx`.
- DoD Checklist: [ ] RTL 단위 (성공/실패 표시) [ ] returnUrl 동작 [ ] 422 필드 펼침

##### Issue: ISS-FE-HOME-01 — HomePage + ArticleCard + FeedTabs + Pagination

- 유형: feature
- 영역: frontend
- 우선순위: P0
- Estimated Effort: 1d
- Acceptance Criteria: Given Home When 회원 진입 Then Your Feed 탭 기본 활성 + ArticleCard 20건 + 사이드바 Popular Tags + 페이지네이션 동작.
- Contract Before: 10 §2 S-01. 05 F-03·F-04·F-10. 04 R-F-06·07·16·19.
- Contract After: `pages/HomePage.tsx` + `components/ArticleCard.tsx`·`FeedTabs.tsx`·`Pagination.tsx`·`TagList.tsx`.
- DoD Checklist: [ ] RTL 단위 [ ] 빈 상태 카피 [ ] 탭 토글 → URL 쿼리 갱신 [ ] 페이지 1→2 동작

##### Issue: ISS-FE-ART-01 — ArticlePage + 마크다운 sanitizer (XSS 방어)

- 유형: feature
- 영역: frontend
- 우선순위: P0
- Estimated Effort: 1d
- Acceptance Criteria: Given `/article/:slug` When 마크다운 body 렌더 Then 헤딩·리스트·코드 변환 + `<script>` 등 위험 태그 제거 (RISK-03).
- Contract Before: 10 §2 S-07. 05 F-06. 04 R-F-08·18·R-N-03.
- Contract After: `pages/ArticlePage.tsx` + `markdown/render.ts`(marked+DOMPurify).
- DoD Checklist: [ ] 단위 (XSS 페이로드 5종) [ ] E2E (`<script>alert(1)` 미실행) [ ] 404 페이지 [ ] javascript: 스킴 제거

##### Issue: ISS-FE-EDIT-01 — EditorPage Create + Edit + Delete

- 유형: feature
- 영역: frontend
- 우선순위: P0
- Estimated Effort: 1d
- Acceptance Criteria: Given `/editor` When 입력 후 Publish Then `/article/:slug` 이동. `/editor/:slug` Edit prefill → 저장. Delete 확인 → 홈 이동.
- Contract Before: 10 §2 S-05·S-06. 05 F-05. 04 R-F-09·10·11.
- Contract After: `pages/EditorPage.tsx` + `api/endpoints/articles.ts` (create/update/delete).
- DoD Checklist: [ ] RTL [ ] 빈 필드 ErrorList [ ] tag pill 입력 [ ] title 변경 시 slug 재생성 후 navigate

##### Issue: ISS-FE-PROFILE-01 — Profile + Settings + Follow/Favorite buttons

- 유형: feature
- 영역: frontend
- 우선순위: P0
- Estimated Effort: 1d
- Acceptance Criteria: Given `/profile/:username` When Follow 클릭 Then 버튼 상태 토글 + Home Your Feed에 즉시 반영. Favorite 버튼 동일. `/settings`에서 bio 변경 → 다른 화면 반영.
- Contract Before: 10 §2 S-04·S-08. 05 F-02·F-07·F-08.
- Contract After: `pages/ProfilePage.tsx`·`SettingsPage.tsx` + `components/FollowButton.tsx`·`FavoriteButton.tsx`.
- DoD Checklist: [ ] RTL (낙관적 업데이트) [ ] 본인 프로필에 Follow 비노출 [ ] 즐겨찾기 탭 동작 [ ] settings 로그아웃 동작

##### Issue: ISS-FE-CMT-01 — CommentForm + CommentItem

- 유형: feature
- 영역: frontend
- 우선순위: P0
- Estimated Effort: 0.5d
- Acceptance Criteria: Given Article 페이지 + 인증 When 댓글 작성 Then 즉시 목록에 표시. 본인 댓글 휴지통 → 즉시 제거. 익명 시 폼 대신 로그인 링크 (05 F-09).
- Contract Before: 10 §2 S-07 댓글 영역. 05 F-09. 04 R-F-13·14·15.
- Contract After: `components/CommentForm.tsx`·`CommentItem.tsx`.
- DoD Checklist: [ ] RTL [ ] 빈 body 422 ErrorList [ ] 타인 댓글 휴지통 비노출

##### Issue: ISS-FE-ROUTE-01 — protectedRoute + returnUrl + 404

- 유형: feature
- 영역: frontend
- 우선순위: P0
- Estimated Effort: 0.5d
- Acceptance Criteria: Given 익명 사용자 When `/settings`·`/editor*` 진입 Then `/login?returnUrl=<원래>` 리다이렉트. 로그인 성공 시 원래 경로 복귀. 미존재 경로 → 404.
- Contract Before: 10 §2 (라우팅). 05 F-11. 04 R-F-17.
- Contract After: `router/protectedRoute.tsx`·`pages/NotFoundPage.tsx`.
- DoD Checklist: [ ] 단위 [ ] E2E returnUrl 흐름 [ ] 401 응답 → 토큰 클리어

##### Issue: ISS-E2E-01 — Playwright 11 골든패스 + XSS + 키보드 a11y

- 유형: test
- 영역: frontend
- 우선순위: P0
- Estimated Effort: 1d
- Acceptance Criteria: Given Playwright 설치 When `./devkit e2e` 실행 Then F-01~F-11 11 시나리오 + F-06 XSS + R-N-06 키보드 a11y 시나리오 모두 PASS (chromium·firefox·webkit).
- Contract Before: 13/02-catalog §3 E2E 카탈로그.
- Contract After: `e2e/tests/auth.e2e.ts`·`articles.e2e.ts`·`comments.e2e.ts`·`follow-feed.e2e.ts`·`markdown-xss.e2e.ts`·`a11y-keyboard.e2e.ts` + `playwright.config.ts`.
- DoD Checklist: [ ] 12 시나리오 PASS [ ] flaky 1회 재시도 정책 [ ] HTML 리포트 artifact [ ] 3 브라우저 matrix

##### Issue: ISS-OPS-09 — docker-compose 운영 점검 + retro + docs-update

- 유형: chore
- 영역: infra
- 우선순위: P1
- Estimated Effort: 0.5d
- Acceptance Criteria: Given prod 모드 When `docker compose up --build` Then frontend(:80)·backend(:3000)·db(PG) 모두 healthy + 마이그레이션 자동 적용. 사용자 가입→로그인→글 작성 골든패스 수동 1회 확인. retro 1장 작성.
- Contract Before: 06 §2. 14 §6 일정 회고.
- Contract After: `docker-compose.yml`·`Dockerfile`(frontend/backend) + `docs/planning/retro/sprint-3-retro.md` + CHANGELOG.md 업데이트.
- DoD Checklist: [ ] compose up 통과 [ ] PG 마이그레이션 dry-run OK (RISK-09) [ ] retro 작성 [ ] CHANGELOG §Current Status 갱신

## 3. 의존성 그래프

```
Sprint 1
  ISS-INFRA-01 ──▶ ISS-INFRA-02 ──▶ ISS-CI-01
        │
        ├──▶ ISS-BE-INIT-01 ─┐
        ├──▶ ISS-BE-INIT-02 ─┴──▶ ISS-BE-AUTH-01 ──▶ ISS-BE-USR-01 ──▶ ISS-BE-USR-02

Sprint 2 (Sprint 1 완료 후)
  ISS-BE-AUTH-01 ──▶ ISS-BE-PRO-01 ──▶ ISS-BE-ART-04 (feed는 follow 필요)
  ISS-BE-INIT-02 ──▶ ISS-BE-ART-01 ──▶ ISS-BE-ART-02 ──▶ ISS-BE-ART-03
                                                  └─▶ ISS-BE-FAV-01
                                                  └─▶ ISS-BE-CMT-01
                                                  └─▶ ISS-BE-TAG-01
  ISS-CI-01 ──▶ ISS-OPS-02 (Newman 컬렉션 채움, BE 완료 후 최종 검증)

Sprint 3 (Sprint 2 완료 후 — BE 안정)
  ISS-FE-INIT-01 ──▶ ISS-FE-AUTH-01 ──▶ ISS-FE-ROUTE-01
                ├──▶ ISS-FE-HOME-01
                ├──▶ ISS-FE-ART-01 ──▶ ISS-FE-CMT-01
                ├──▶ ISS-FE-EDIT-01
                └──▶ ISS-FE-PROFILE-01
  (모든 FE 완료) ──▶ ISS-E2E-01 ──▶ ISS-OPS-09
```

- **순환 없음(DAG 검증)**: 모든 화살표는 Sprint N → Sprint M (N ≤ M) 방향.
- **인접 sprint 의존**: Sprint 2의 ISS-OPS-02는 Sprint 1의 ISS-CI-01에 의존(같은 워크플로 확장).
- **Blocked-by 라벨 매핑**: 같은 sprint 내 의존성은 GitHub issue body의 `Blocked-by: #<n>`로 명시 (P10 docs-update 시점 갱신).

## 4. 추적성 매트릭스

| R-ID | F-ID | Sprint | Issue Slug |
|---|---|---|---|
| R-F-01 | F-01 | 1 | ISS-BE-USR-01 |
| R-F-02 | F-01 | 1 | ISS-BE-USR-01 |
| R-F-03 | F-01, F-02 | 1 | ISS-BE-USR-02 |
| R-F-04 | F-02 | 2 | ISS-BE-PRO-01 |
| R-F-05 | F-08 | 2 | ISS-BE-PRO-01 |
| R-F-06 | F-03 | 2 | ISS-BE-ART-01 |
| R-F-07 | F-04 | 2 | ISS-BE-ART-04 |
| R-F-08 | F-06 | 2 | ISS-BE-ART-01 |
| R-F-09 | F-05 | 2 | ISS-BE-ART-02 |
| R-F-10 | F-05 | 2 | ISS-BE-ART-03 |
| R-F-11 | F-05 | 2 | ISS-BE-ART-03 |
| R-F-12 | F-07 | 2 | ISS-BE-FAV-01 |
| R-F-13 | F-09 | 2 | ISS-BE-CMT-01 |
| R-F-14 | F-09 | 2 | ISS-BE-CMT-01 |
| R-F-15 | F-09 | 2 | ISS-BE-CMT-01 |
| R-F-16 | F-10 | 2 | ISS-BE-TAG-01 |
| R-F-17 | F-11 | 3 | ISS-FE-ROUTE-01 |
| R-F-18 | F-06 | 3 | ISS-FE-ART-01 |
| R-F-19 | F-03 | 3 | ISS-FE-HOME-01 |
| R-N-01 | (전역) | 2 | ISS-OPS-02 |
| R-N-02 | F-01 | 1 | ISS-BE-AUTH-01 |
| R-N-03 | (전역) | 1 | ISS-BE-INIT-01 |
| R-N-04 | (전역) | 1, 2 | ISS-BE-INIT-02 + ISS-BE-ART-03 |
| R-N-05 | (전역) | 1 | ISS-BE-INIT-02 (인덱스) — 부하 측정은 운영 deferral |
| R-N-06 | F-03, F-05 | 3 | ISS-E2E-01 (키보드 a11y) |
| F-01 | F-01 | 1, 3 | ISS-BE-USR-01 + ISS-FE-AUTH-01 |
| F-02 | F-02 | 1, 2, 3 | ISS-BE-USR-02 + ISS-BE-PRO-01 + ISS-FE-PROFILE-01 |
| F-03 | F-03 | 2, 3 | ISS-BE-ART-01 + ISS-FE-HOME-01 |
| F-04 | F-04 | 2, 3 | ISS-BE-ART-04 + ISS-FE-HOME-01 |
| F-05 | F-05 | 2, 3 | ISS-BE-ART-02·03 + ISS-FE-EDIT-01 |
| F-06 | F-06 | 2, 3 | ISS-BE-ART-01 + ISS-FE-ART-01 |
| F-07 | F-07 | 2, 3 | ISS-BE-FAV-01 + ISS-FE-PROFILE-01 |
| F-08 | F-08 | 2, 3 | ISS-BE-PRO-01 + ISS-FE-PROFILE-01 |
| F-09 | F-09 | 2, 3 | ISS-BE-CMT-01 + ISS-FE-CMT-01 |
| F-10 | F-10 | 2, 3 | ISS-BE-TAG-01 + ISS-FE-HOME-01 |
| F-11 | F-11 | 3 | ISS-FE-ROUTE-01 |

> 모든 R-F-01~19, R-N-01~06, F-01~11 가 1개 이상 이슈에 매핑됨 (BLOCK 충족).

## 5. 리스크 매핑

| 15-risk Risk-ID | 영향 받는 Sprint/Issue | 대응 이슈 |
|---|---|---|
| RISK-01 (사양 변경) | Sprint 2 (Newman) | ISS-OPS-02 |
| RISK-02 (Bearer vs Token) | Sprint 1 (인증) | ISS-BE-AUTH-01 |
| RISK-03 (XSS) | Sprint 3 (Article 렌더) | ISS-FE-ART-01 + ISS-E2E-01 |
| RISK-04 (JWT/secret) | Sprint 1 (인증) | ISS-INFRA-01·02 + ISS-BE-AUTH-01 |
| RISK-05 (slug 충돌) | Sprint 2 (글 작성) | ISS-BE-ART-02 |
| RISK-06 (cascade 누락) | Sprint 1·2 (DB) | ISS-BE-INIT-02 + ISS-BE-ART-03 |
| RISK-07 (Newman 어긋남) | Sprint 1·2·3 | ISS-CI-01 + ISS-OPS-02 |
| RISK-08 (E2E flaky) | Sprint 3 (E2E) | ISS-E2E-01 |
| RISK-09 (SQLite vs PG) | Sprint 3 (배포) | ISS-OPS-09 |
| RISK-10 (일정 압박) | Sprint 1·2·3 | (전 sprint) — retro로 재조정 |
| RISK-11 (toolkit hook) | Sprint 1·2·3 | (메타 운영, 별도 이슈 없음) |

## 6. 일정

- **Sprint 1**: 2026-05-18 ~ 2026-05-22 (5 working days). 추정 효율 효과는 ~6d — 인증 라이브러리 학습 곡선 + 첫 Prisma 마이그레이션 비용.
- **Sprint 2**: 2026-05-25 ~ 2026-05-29 (5d). 추정 ~7.5d. Newman 컬렉션 적합 작업이 1d~1.5d로 늘 수 있음 (RISK-07).
- **Sprint 3**: 2026-06-01 ~ 2026-06-05 (5d). 추정 ~8d. **가장 일정 압박이 큰 sprint** (RISK-10). 일정 슬립 시 ISS-OPS-09의 “retro”·“CHANGELOG 업데이트”를 운영 단계로 deferral.
- **총 추정**: ~17.5 working days vs 15d 가용 → 약 17%~20% 오버. 완화 방향:
  - 외부 RealWorld FE 상호운용성 KPI 운영 단계 deferral (01 §4 마지막 행).
  - 부하 테스트(R-N-05) MVP에서 수행 안 함.
  - Sprint 3에 “Sprint 4 예비”를 1~2d 확보 (사용자 결정).
- **Sprint 종료 의식**: 매 Sprint 마지막 일에 (a) sprint demo, (b) retro 1장 (단, MVP는 Sprint 3에 통합), (c) 다음 sprint 이슈 우선순위 재조정.
- **휴먼 게이트**: 각 sprint 종료 시 사용자 PR 머지 승인 (CLAUDE.md §사용자 승인 — 배포/운영만 명시이나 본 MVP는 sprint 종료를 휴먼 게이트로 강제 권장).

## 7. sprint-bootstrap 입력

```yaml
project:
  name: conduit-realworld
  slug: conduit-realworld
  default_branch: main
  description: "RealWorld Conduit (Medium clone) — TypeScript + React + Express + Prisma. RFP: https://realworld-docs.netlify.app/"

labels:
  status:
    - name: "status:todo"
    - name: "status:in-progress"
    - name: "status:in-review"
    - name: "status:blocked"
  area:
    - name: "area:frontend"
    - name: "area:backend"
    - name: "area:infra"
    - name: "area:docs"
  type:
    - name: "type:feature"
    - name: "type:chore"
    - name: "type:test"
    - name: "type:docs"
    - name: "type:bug"
  priority:
    - name: "P0"
    - name: "P1"
    - name: "P2"

sprints:
  - number: 1
    title: "Sprint 1 — Foundation + Auth"
    start: "2026-05-18"
    end:   "2026-05-22"
    goal:  "모노레포·CI 부트스트랩 + 인증 도메인. R-F-01~03 + R-N-02·03·04 베이스 구축."
    issues:
      - slug: ISS-INFRA-01
        title: "[Sprint 1] 모노레포·devkit·docker-compose 부트스트랩"
        labels: [type:chore, area:infra, P0, status:todo]
        effort: 1d
        r_ids: []
        f_ids: []
        body_ref: "docs/planning/14-wbs/14-wbs.md#issue-iss-infra-01"
      - slug: ISS-INFRA-02
        title: "[Sprint 1] ESLint·Prettier·Husky·lint-staged"
        labels: [type:chore, area:infra, P0, status:todo]
        effort: 0.5d
        r_ids: []
        f_ids: []
      - slug: ISS-CI-01
        title: "[Sprint 1] GitHub Actions CI baseline + Newman placeholder"
        labels: [type:chore, area:infra, P0, status:todo]
        effort: 0.5d
        r_ids: [R-N-01]
        f_ids: []
      - slug: ISS-BE-INIT-01
        title: "[Sprint 1] Express app + 미들웨어 체인 + ErrorMapper"
        labels: [type:feature, area:backend, P0, status:todo]
        effort: 1d
        r_ids: [R-N-03]
        f_ids: []
      - slug: ISS-BE-INIT-02
        title: "[Sprint 1] Prisma schema + 마이그레이션 + seed"
        labels: [type:feature, area:backend, P0, status:todo]
        effort: 1d
        r_ids: [R-N-04, R-N-05]
        f_ids: []
      - slug: ISS-BE-AUTH-01
        title: "[Sprint 1] JwtService + AuthMiddleware (Token 헤더 강제)"
        labels: [type:feature, area:backend, P0, status:todo]
        effort: 0.5d
        r_ids: [R-N-02]
        f_ids: [F-01]
      - slug: ISS-BE-USR-01
        title: "[Sprint 1] UserService.register + login"
        labels: [type:feature, area:backend, P0, status:todo]
        effort: 1d
        r_ids: [R-F-01, R-F-02]
        f_ids: [F-01]
      - slug: ISS-BE-USR-02
        title: "[Sprint 1] GET/PUT /api/user"
        labels: [type:feature, area:backend, P0, status:todo]
        effort: 0.5d
        r_ids: [R-F-03]
        f_ids: [F-01, F-02]

  - number: 2
    title: "Sprint 2 — BE 도메인 + Newman"
    start: "2026-05-25"
    end:   "2026-05-29"
    goal:  "BE 19 엔드포인트 완성 + Newman 23 케이스 PASS."
    issues:
      - slug: ISS-BE-PRO-01
        title: "[Sprint 2] Profile + Follow/Unfollow"
        labels: [type:feature, area:backend, P0, status:todo]
        effort: 1d
        r_ids: [R-F-04, R-F-05]
        f_ids: [F-02, F-08]
      - slug: ISS-BE-ART-01
        title: "[Sprint 2] Articles 목록 + 상세 GET"
        labels: [type:feature, area:backend, P0, status:todo]
        effort: 1d
        r_ids: [R-F-06, R-F-08]
        f_ids: [F-03, F-06]
      - slug: ISS-BE-ART-02
        title: "[Sprint 2] Articles POST + slug 생성기"
        labels: [type:feature, area:backend, P0, status:todo]
        effort: 1d
        r_ids: [R-F-09]
        f_ids: [F-05]
      - slug: ISS-BE-ART-03
        title: "[Sprint 2] Articles PUT + DELETE + cascade"
        labels: [type:feature, area:backend, P0, status:todo]
        effort: 1d
        r_ids: [R-F-10, R-F-11, R-N-04]
        f_ids: [F-05]
      - slug: ISS-BE-ART-04
        title: "[Sprint 2] Your Feed"
        labels: [type:feature, area:backend, P0, status:todo]
        effort: 0.5d
        r_ids: [R-F-07]
        f_ids: [F-04]
      - slug: ISS-BE-FAV-01
        title: "[Sprint 2] Favorite POST/DELETE"
        labels: [type:feature, area:backend, P0, status:todo]
        effort: 0.5d
        r_ids: [R-F-12]
        f_ids: [F-07]
      - slug: ISS-BE-CMT-01
        title: "[Sprint 2] Comments CRUD"
        labels: [type:feature, area:backend, P0, status:todo]
        effort: 1d
        r_ids: [R-F-13, R-F-14, R-F-15]
        f_ids: [F-09]
      - slug: ISS-BE-TAG-01
        title: "[Sprint 2] Tags GET"
        labels: [type:feature, area:backend, P1, status:todo]
        effort: 0.5d
        r_ids: [R-F-16]
        f_ids: [F-10]
      - slug: ISS-OPS-02
        title: "[Sprint 2] Newman CI + Postman 컬렉션 + 23 케이스 PASS"
        labels: [type:chore, area:infra, P0, status:todo]
        effort: 1d
        r_ids: [R-N-01]
        f_ids: []

  - number: 3
    title: "Sprint 3 — Frontend SPA + E2E + Polish"
    start: "2026-06-01"
    end:   "2026-06-05"
    goal:  "FE 7 라우트 + E2E 골든패스 + XSS 방어 + Docker compose 검증."
    issues:
      - slug: ISS-FE-INIT-01
        title: "[Sprint 3] Vite + RouterShell + AuthCtx + ApiClient"
        labels: [type:feature, area:frontend, P0, status:todo]
        effort: 1d
        r_ids: [R-F-17, R-N-02]
        f_ids: [F-11]
      - slug: ISS-FE-AUTH-01
        title: "[Sprint 3] LoginPage + RegisterPage + ErrorList"
        labels: [type:feature, area:frontend, P0, status:todo]
        effort: 0.5d
        r_ids: [R-F-01, R-F-02]
        f_ids: [F-01]
      - slug: ISS-FE-HOME-01
        title: "[Sprint 3] HomePage + ArticleCard + FeedTabs + Pagination"
        labels: [type:feature, area:frontend, P0, status:todo]
        effort: 1d
        r_ids: [R-F-06, R-F-07, R-F-16, R-F-19]
        f_ids: [F-03, F-04, F-10]
      - slug: ISS-FE-ART-01
        title: "[Sprint 3] ArticlePage + 마크다운 sanitizer (XSS 방어)"
        labels: [type:feature, area:frontend, P0, status:todo]
        effort: 1d
        r_ids: [R-F-08, R-F-18, R-N-03]
        f_ids: [F-06]
      - slug: ISS-FE-EDIT-01
        title: "[Sprint 3] EditorPage Create + Edit + Delete"
        labels: [type:feature, area:frontend, P0, status:todo]
        effort: 1d
        r_ids: [R-F-09, R-F-10, R-F-11]
        f_ids: [F-05]
      - slug: ISS-FE-PROFILE-01
        title: "[Sprint 3] ProfilePage + SettingsPage + Follow/Favorite buttons"
        labels: [type:feature, area:frontend, P0, status:todo]
        effort: 1d
        r_ids: [R-F-03, R-F-04, R-F-05, R-F-12]
        f_ids: [F-02, F-07, F-08]
      - slug: ISS-FE-CMT-01
        title: "[Sprint 3] CommentForm + CommentItem"
        labels: [type:feature, area:frontend, P0, status:todo]
        effort: 0.5d
        r_ids: [R-F-13, R-F-14, R-F-15]
        f_ids: [F-09]
      - slug: ISS-FE-ROUTE-01
        title: "[Sprint 3] protectedRoute + returnUrl + 404"
        labels: [type:feature, area:frontend, P0, status:todo]
        effort: 0.5d
        r_ids: [R-F-17]
        f_ids: [F-11]
      - slug: ISS-E2E-01
        title: "[Sprint 3] Playwright 12 골든패스 + XSS + 키보드 a11y"
        labels: [type:test, area:frontend, P0, status:todo]
        effort: 1d
        r_ids: [R-N-06, R-F-18]
        f_ids: [F-01, F-02, F-03, F-04, F-05, F-06, F-07, F-08, F-09, F-10, F-11]
      - slug: ISS-OPS-09
        title: "[Sprint 3] docker-compose 운영 점검 + retro + docs-update"
        labels: [type:chore, area:infra, P1, status:todo]
        effort: 0.5d
        r_ids: []
        f_ids: []
```

## 8. Open Questions

- **OQ-W1** — 외부 RealWorld FE 상호운용성 KPI(01 §4 마지막 행, 05 OQ-P1, RISK-10)를 MVP에 둘지 운영 단계로 deferral할지 — Sprint 3 일정에 영향. 사용자 결정 필요.
- **OQ-W2** — Sprint 3 일정 슬립 시 “Sprint 4(예비)”를 추가할지, 또는 일부 이슈 deferral할지. 옵션: (a) +2d 추가, (b) ISS-OPS-09 retro 축소, (c) E2E 일부 시나리오 풀세트가 아닌 스모크만.
- **OQ-W3** — JWT exp=24h·slug 정책 등 NEW_PROJECT 결정 사항(01 O-01·02)을 별 ADR(`adr/0001-jwt-and-slug-policy.md`) 신설할지 — Sprint 1 산출에 포함하면 좋으나 시간 부족 시 Sprint 3 ISS-OPS-09 안에 묶음.
- **OQ-W4** — Sprint 2의 ISS-OPS-02 Newman 컬렉션 사본의 라이선스(MIT) 인용 위치 — README와 컬렉션 파일 둘 다 명시 권고.
