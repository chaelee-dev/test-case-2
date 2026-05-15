---
doc_type: module-spec
version: v0.1 (Draft)
status: Draft
author: yongtae.cho@bespinglobal.com
date: 2026-05-15
gate: C
related:
  R-ID: [R-F-01, R-F-02, R-F-03, R-F-04, R-F-05, R-F-06, R-F-07, R-F-08, R-F-09, R-F-10, R-F-11, R-F-12, R-F-13, R-F-14, R-F-15, R-F-16, R-F-17, R-F-18, R-N-02, R-N-03, R-N-04]
  F-ID: [F-01, F-02, F-03, F-04, F-05, F-06, F-07, F-08, F-09, F-10, F-11]
  supersedes: null
---

# Conduit (RealWorld) — Module Spec (LLD — 모듈/통신)

<!-- ADR-0031: 본 LLD §1 각 모듈은 07 HLD §1 핵심 모듈/컴포넌트 표의 fan-out. 07 §1 참조 BLOCK. -->

## 변경 이력

| Version | Date | Author | Change |
|---|---|---|---|
| v0.1 | 2026-05-15 | yongtae.cho@bespinglobal.com | 초안 — FE 6 + BE 9 모듈 LLD |

## 1. 모듈 개요

> 각 모듈은 07 HLD §1 “핵심 모듈 / 컴포넌트” 표의 한 행에서 fan-out한다. “07 HLD §1 참조”는 본 LLD 갱신 시 07 §1 표 행과 함께 갱신한다.

### M-FE-RouterShell

- **모듈 ID**: M-FE-RouterShell
- **책임**: React Router 6로 7 라우트 정의 + 보호 라우트 가드 + returnUrl 처리 + 404 페이지.
- **07 HLD §1 참조**: 07 §1 “M-FE-RouterShell” 행 (M-FE 1번).
- **R-ID 매핑**: R-F-17
- **F-ID 매핑**: F-11
- 위치: `frontend/src/router/`

### M-FE-AuthCtx

- **모듈 ID**: M-FE-AuthCtx
- **책임**: JWT 토큰 보관(localStorage `conduit.jwt`) + 로그인/로그아웃 액션 + 현재 사용자 정보 캐시.
- **07 HLD §1 참조**: 07 §1 “M-FE-AuthCtx” 행.
- **R-ID 매핑**: R-F-01, R-F-02, R-F-03, R-N-02
- **F-ID 매핑**: F-01, F-02
- 위치: `frontend/src/auth/`

### M-FE-ApiClient

- **모듈 ID**: M-FE-ApiClient
- **책임**: fetch 래퍼 + `Authorization: Token <jwt>` 자동 부착 + 표준 오류 응답 파서(`{errors:{...}}`).
- **07 HLD §1 참조**: 07 §1 “M-FE-ApiClient” 행.
- **R-ID 매핑**: R-F-01~R-F-19 (전엔드포인트 호출), R-N-02, R-N-03
- **F-ID 매핑**: F-01~F-11
- 위치: `frontend/src/api/`

### M-FE-Pages

- **모듈 ID**: M-FE-Pages
- **책임**: 7 라우트 페이지 컴포넌트 — Home·Login·Register·Settings·Editor·Article·Profile.
- **07 HLD §1 참조**: 07 §1 “M-FE-Pages” 행.
- **R-ID 매핑**: R-F-17, R-F-08, R-F-09, R-F-10
- **F-ID 매핑**: F-01, F-02, F-03, F-04, F-05, F-06, F-07, F-08, F-09, F-10, F-11
- 위치: `frontend/src/pages/`

### M-FE-Components

- **모듈 ID**: M-FE-Components
- **책임**: 공용 UI — ArticleCard·Pagination·TagList·CommentItem·ErrorList·FollowButton·FavoriteButton.
- **07 HLD §1 참조**: 07 §1 “M-FE-Components” 행.
- **R-ID 매핑**: R-F-08, R-F-12, R-F-19, R-N-03
- **F-ID 매핑**: F-03, F-06, F-07, F-08, F-09
- 위치: `frontend/src/components/`

### M-FE-Markdown

- **모듈 ID**: M-FE-Markdown
- **책임**: marked + DOMPurify 단일 래퍼 — Article body·Comment body 렌더 시 사용. XSS 방어 화이트리스트.
- **07 HLD §1 참조**: 07 §1 “M-FE-Markdown” 행.
- **R-ID 매핑**: R-F-18
- **F-ID 매핑**: F-06
- 위치: `frontend/src/markdown/`

### M-BE-HttpServer

- **모듈 ID**: M-BE-HttpServer
- **책임**: Express 부트스트랩 + 미들웨어 체인(cors → json → logger(traceId) → routers → errorHandler).
- **07 HLD §1 참조**: 07 §1 “M-BE-HttpServer” 행.
- **R-ID 매핑**: R-N-02, R-N-03
- **F-ID 매핑**: (인프라성, F-ID 없음)
- 위치: `backend/src/server.ts`, `backend/src/app.ts`

### M-BE-AuthMiddleware

- **모듈 ID**: M-BE-AuthMiddleware
- **책임**: `Authorization: Token <jwt>` 파싱 → JwtService.verify → UserRepo lookup → `req.user`. optional/required 두 변종.
- **07 HLD §1 참조**: 07 §1 “M-BE-AuthMiddleware” 행.
- **R-ID 매핑**: R-N-02
- **F-ID 매핑**: F-01, F-02, F-03, F-04, F-05, F-07, F-08, F-09, F-11
- 위치: `backend/src/middleware/auth.ts`

### M-BE-Routers

- **모듈 ID**: M-BE-Routers
- **책임**: 19 엔드포인트 라우팅 정의 → controller 호출. 라우터 자체는 얇은 어댑터(전송→Service 호출→직렬화).
- **07 HLD §1 참조**: 07 §1 “M-BE-Routers” 행.
- **R-ID 매핑**: R-F-01~R-F-16, R-F-19
- **F-ID 매핑**: F-01~F-10
- 위치: `backend/src/routes/` (`users.ts`, `profiles.ts`, `articles.ts`, `comments.ts`, `tags.ts`)

### M-BE-UserService

- **모듈 ID**: M-BE-UserService
- **책임**: 가입(register)·로그인(login)·현재 사용자 조회·갱신·프로필 조회·팔로우/언팔로우.
- **07 HLD §1 참조**: 07 §1 “M-BE-UserService” 행.
- **R-ID 매핑**: R-F-01, R-F-02, R-F-03, R-F-04, R-F-05
- **F-ID 매핑**: F-01, F-02, F-08
- 위치: `backend/src/services/userService.ts`

### M-BE-ArticleService

- **모듈 ID**: M-BE-ArticleService
- **책임**: 글 CRUD + 필터 목록 + Your Feed + 즐겨찾기 toggle. slug 생성기 포함.
- **07 HLD §1 참조**: 07 §1 “M-BE-ArticleService” 행.
- **R-ID 매핑**: R-F-06, R-F-07, R-F-08, R-F-09, R-F-10, R-F-11, R-F-12, R-F-16
- **F-ID 매핑**: F-03, F-04, F-05, F-06, F-07, F-10
- 위치: `backend/src/services/articleService.ts`

### M-BE-CommentService

- **모듈 ID**: M-BE-CommentService
- **책임**: 댓글 목록·작성·삭제 + 권한 가드(comment.author == viewer).
- **07 HLD §1 참조**: 07 §1 “M-BE-CommentService” 행.
- **R-ID 매핑**: R-F-13, R-F-14, R-F-15
- **F-ID 매핑**: F-09
- 위치: `backend/src/services/commentService.ts`

### M-BE-Repos

- **모듈 ID**: M-BE-Repos
- **책임**: Prisma Client 래퍼 6종 — UserRepo·ArticleRepo·CommentRepo·TagRepo·FavoriteRepo·FollowRepo. 도메인 객체로 변환.
- **07 HLD §1 참조**: 07 §1 “M-BE-Repos” 행.
- **R-ID 매핑**: R-N-04, R-N-05 (인덱스), R-F-06·07·12 (쿼리)
- **F-ID 매핑**: 전 F-ID
- 위치: `backend/src/repos/`, schema `backend/prisma/schema.prisma`

### M-BE-ErrorMapper

- **모듈 ID**: M-BE-ErrorMapper
- **책임**: 도메인 오류(`ValidationError`·`NotFoundError`·`ForbiddenError`·`UnauthorizedError`) → `{errors:{...}}` + 422/404/403/401.
- **07 HLD §1 참조**: 07 §1 “M-BE-ErrorMapper” 행.
- **R-ID 매핑**: R-N-03
- **F-ID 매핑**: (전역, F-ID 없음)
- 위치: `backend/src/middleware/errorHandler.ts`, `backend/src/errors/`

### M-BE-JwtService

- **모듈 ID**: M-BE-JwtService
- **책임**: JWT sign(payload={userId}, exp=24h) / verify. 비밀키는 env `JWT_SECRET`.
- **07 HLD §1 참조**: 07 §1 “M-BE-JwtService” 행.
- **R-ID 매핑**: R-N-02
- **F-ID 매핑**: F-01
- 위치: `backend/src/services/jwtService.ts`

## 2. 외부 인터페이스

| 인터페이스 | 입력 | 출력 | 에러 |
|---|---|---|---|
| `M-FE-ApiClient.get/post/put/del(path, body?, opts?)` | path: string, body?: JSON, opts: { auth?: boolean } | Promise<{ data | errors, status }> | 네트워크 실패: `{ errors: { body: ['network error'] } }`. 4xx/5xx는 errors 그대로 |
| `M-FE-AuthCtx.login(token, user)` / `.logout()` / `.useAuth()` (hook) | token: string \| null, user: User \| null | void / `{ user, token, isAuthed }` | 없음 (저장만) |
| `M-FE-Markdown.render(md)` | md: string | sanitized HTML string | 항상 안전 — 의심 입력은 escape |
| `M-BE-AuthMiddleware.requireAuth` / `optionalAuth` | Express `req` | `req.user` 부착, 다음 미들웨어 호출 | 누락/만료: 401 `errors.body:["unauthorized"]` |
| `M-BE-UserService.register(input)` | `{username,email,password}` | `{user, token}` | ValidationError(422) — 필드별. ConflictError(422) — username/email 중복 |
| `M-BE-UserService.login(input)` | `{email,password}` | `{user, token}` | ValidationError(422) — `"email or password is invalid"` |
| `M-BE-UserService.getCurrent(userId)` / `.update(userId, patch)` | userId, patch | user | UnauthorizedError(401), ValidationError(422) |
| `M-BE-UserService.follow(viewerId, username)` / `.unfollow(...)` | viewerId, username | profile | NotFoundError(404), ValidationError(422 self-follow), UnauthorizedError(401) |
| `M-BE-ArticleService.list(filter)` / `.feed(viewerId, page)` | filter: `{tag?,author?,favorited?,limit,offset}` | `{articles, articlesCount}` | ValidationError(422 limit>100) |
| `M-BE-ArticleService.get(slug, viewerId?)` | slug, viewerId? | article | NotFoundError(404) |
| `M-BE-ArticleService.create(userId, input)` | userId, `{title,description,body,tagList?}` | article | ValidationError(422), UnauthorizedError(401) |
| `M-BE-ArticleService.update(userId, slug, patch)` | userId, slug, patch | article | NotFound(404), Forbidden(403), Validation(422), Unauthorized(401) |
| `M-BE-ArticleService.delete(userId, slug)` | userId, slug | void | NotFound(404), Forbidden(403), Unauthorized(401) |
| `M-BE-ArticleService.favorite(userId, slug)` / `.unfavorite(...)` | userId, slug | article (favorited 갱신) | NotFound(404), Unauthorized(401) |
| `M-BE-CommentService.list(slug, viewerId?)` / `.create(userId, slug, body)` / `.delete(userId, slug, id)` | (위와 동일 패턴) | comments[] / comment / void | NotFound(404), Forbidden(403), Validation(422), Unauthorized(401) |
| `M-BE-JwtService.sign(userId)` / `.verify(token)` | userId / token | jwt 문자열 / `{userId}` | InvalidToken: throws |

## 3. 내부 컴포넌트

| 모듈 | 내부 핵심 컴포넌트 | 역할 |
|---|---|---|
| M-FE-AuthCtx | `AuthProvider`, `useAuth()`, `tokenStorage` | Context Provider + hook + localStorage adapter |
| M-FE-ApiClient | `apiFetch()`, `parseErrors()`, `withAuthHeader()` | 베이스 fetch + 응답 파서 + 헤더 부착 |
| M-FE-Pages | `HomePage`, `LoginPage`, `RegisterPage`, `SettingsPage`, `EditorPage`, `ArticlePage`, `ProfilePage` | 라우트 1:1 |
| M-FE-Components | `ArticleCard`, `Pagination`, `TagList`, `CommentItem`, `ErrorList`, `FollowButton`, `FavoriteButton`, `FeedTabs` | 공용 |
| M-FE-Markdown | `renderMarkdown(md)`, `purifyConfig` | marked + DOMPurify |
| M-BE-HttpServer | `createApp()`, `requestLogger`, `errorHandler` | Express factory + 미들웨어 |
| M-BE-AuthMiddleware | `requireAuth`, `optionalAuth`, `extractToken` | 헤더 파서 |
| M-BE-Routers | 5 라우터 모듈 — `users.ts`·`profiles.ts`·`articles.ts`·`comments.ts`·`tags.ts` | 19 엔드포인트 등록 |
| M-BE-UserService | `register`, `login`, `getCurrent`, `update`, `getProfile`, `follow`, `unfollow` | 도메인 로직 |
| M-BE-ArticleService | `list`, `feed`, `get`, `create`, `update`, `delete`, `favorite`, `unfavorite`, `generateSlug` | 도메인 로직 |
| M-BE-CommentService | `list`, `create`, `delete`, `checkOwner` | 도메인 로직 |
| M-BE-Repos | `UserRepo`, `ArticleRepo`, `CommentRepo`, `TagRepo`, `FavoriteRepo`, `FollowRepo` | Prisma 래퍼 |
| M-BE-ErrorMapper | `ValidationError`, `NotFoundError`, `ForbiddenError`, `UnauthorizedError`, `mapError()` | 에러 클래스 + 매퍼 |
| M-BE-JwtService | `sign`, `verify` | jsonwebtoken 래퍼 |

## 4. 데이터 흐름

> 모듈 간 흐름의 큰 그림은 07 HLD §2. 본 절은 *모듈 내부* 흐름의 보강.

- **로그인 (M-BE-UserService.login)**: 입력 검증(zod) → UserRepo.findByEmail → bcrypt.compare → 실패 시 `throw ValidationError("email or password","is invalid")` (사용자 존재성 비노출) → 성공 시 JwtService.sign → `{user, token}` 반환.
- **글 작성 (M-BE-ArticleService.create)**: 트랜잭션 시작 → slug 생성(`slugify(title)`; 충돌 시 `-<6자 base36 해시>` suffix) → ArticleRepo.insert → tagList 각 태그 TagRepo.upsert → ArticleTagRepo.link → 트랜잭션 커밋 → 직렬화된 article 반환.
- **즐겨찾기 토글 (M-BE-ArticleService.favorite)**: ArticleRepo.findBySlug → 미존재 시 NotFoundError → FavoriteRepo.upsert (unique 충돌은 do nothing) → ArticleRepo.findBySlugWithCount → 직렬화.
- **Your Feed (M-BE-ArticleService.feed)**: FollowRepo.followeeIds(viewerId) → ArticleRepo.list(`author_id IN (...)`, orderBy createdAt DESC, limit, offset) + count.
- **글 삭제 (M-BE-ArticleService.delete)**: ArticleRepo.findBySlug → 미존재 404 → article.authorId ≠ viewerId → ForbiddenError → ArticleRepo.delete (Prisma cascade: ArticleTag, Comment, Favorite 자동).

## 5. 상태·라이프사이클

- **JWT 라이프사이클(FE)**: 가입/로그인 성공 시 `M-FE-AuthCtx.login(token, user)` → localStorage 저장 → 모든 API 호출에 헤더 부착. 401 응답 시 `logout()` 자동 호출 → `/login?returnUrl=<cur>`로 라우팅.
- **요청 라이프사이클(BE)**: cors → json → logger(traceId 부여) → router → service → repo → service → errorMapper(있다면) → response. 모든 5xx는 traceId 로그.
- **트랜잭션 라이프사이클**: ArticleService.create / update / delete 는 Prisma `$transaction` 안. 즐겨찾기·팔로우 토글은 단일 upsert/delete로 충분.

## 6. 에러 처리

| 에러 | 발생 조건 | 처리 |
|---|---|---|
| `ValidationError(field, msg)` → 422 | 필드 검증 실패, limit>100, self-follow, 빈 body 등 | `{errors:{<field>:[msg]}}` |
| `UnauthorizedError(msg='unauthorized')` → 401 | JWT 누락/만료/위조, Bearer prefix 시도 | `{errors:{body:[msg]}}` + FE는 토큰 클리어 |
| `ForbiddenError(msg='forbidden')` → 403 | 타인 글/댓글 PUT/DELETE | `{errors:{body:[msg]}}` |
| `NotFoundError(msg)` → 404 | 미존재 slug/username/comment id | `{errors:{body:[msg]}}` |
| `ConflictError(field, msg='has already been taken')` → 422 | username/email/slug 중복 (사양 충실) | `{errors:{<field>:[msg]}}` (HTTP 422, 409는 사용 안 함) |
| `InternalError` → 5xx | 미예상 throw | `{errors:{body:['internal server error']}}` + traceId 로그 |

- **금지**: 라우터/서비스에서 `res.status().json()` 직접 호출 금지. 반드시 throw → `M-BE-ErrorMapper`가 응답.
- **사양 준수**: 사양 외 HTTP 코드(409·400 등) 사용 금지. 422/401/403/404/5xx만.

## 7. 동시성·트랜잭션

- **트랜잭션 단위**: Service. ArticleService.create/update/delete는 `prisma.$transaction([...])`로 묶음.
- **race**: 동시 가입(같은 username) — DB unique 제약 + 한쪽만 성공 (ConflictError로 매핑).
- **idempotency**: Favorite/Follow는 unique 복합키. 중복 POST/POST → upsert로 동일 상태 보장(R-N-04).
- **slug 충돌 처리**: ArticleService.generateSlug() — 최초 시도 충돌 시 6자 base36 해시 suffix 1회 부여, 그래도 충돌이면 throw(매우 희박).

## 8. 테스트 진입점

| 모듈 | 단위 테스트 진입점 (Vitest) | 통합 테스트 진입점 | E2E 진입점 (Playwright) |
|---|---|---|---|
| M-BE-UserService | `services/userService.spec.ts` (register/login/follow 함수) | `routes/users.int.spec.ts` (supertest + 실 DB) | `auth.e2e.ts` (register→login→header) |
| M-BE-ArticleService | `services/articleService.spec.ts` (slug, feed, favorite) | `routes/articles.int.spec.ts` | `articles.e2e.ts` (CRUD 골든패스) |
| M-BE-CommentService | `services/commentService.spec.ts` | `routes/comments.int.spec.ts` | `comments.e2e.ts` |
| M-BE-ErrorMapper | `middleware/errorHandler.spec.ts` (단위) | `int/error-shape.spec.ts` (실 응답 구조) | (전 시나리오에서 간접) |
| M-BE-JwtService | `services/jwtService.spec.ts` | (단위 위주, 통합은 AuthMiddleware) | (간접) |
| M-FE-AuthCtx | `auth/AuthProvider.spec.tsx` (RTL) | N/A (FE 단독) | `auth.e2e.ts` (로그인 흐름) |
| M-FE-ApiClient | `api/apiClient.spec.ts` (msw 모의) | N/A | (간접) |
| M-FE-Markdown | `markdown/render.spec.ts` (XSS 케이스 포함) | N/A | `article.e2e.ts` (`<script>` 미실행 검증) |
| M-FE-Pages | 컴포넌트별 RTL 단위 | N/A | 페이지별 골든패스 E2E |
| M-FE-Components | 컴포넌트별 RTL 단위 | N/A | (간접) |
| Newman 회귀 | N/A | `ci/newman.spec.ts` (CI job) — 23 케이스 PASS (R-N-01) | N/A |

- **카탈로그 정본**: 13-test-design/02-catalog.md — 위 진입점은 그 카탈로그의 *실행 위치*를 명시한 보조 표.
