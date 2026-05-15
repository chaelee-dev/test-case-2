---
doc_type: screen-design
version: v0.1 (Draft)
status: Draft
author: yongtae.cho@bespinglobal.com
date: 2026-05-15
gate: C
related:
  R-ID: [R-F-08, R-F-09, R-F-13, R-F-17, R-F-18, R-F-19, R-N-06]
  F-ID: [F-01, F-02, F-03, F-04, F-05, F-06, F-07, F-08, F-09, F-10, F-11]
  supersedes: null
---

# Conduit (RealWorld) — Screen Design (LLD — UI)

<!-- RealWorld 공식 Bootstrap 4 템플릿 1:1. 자체 디자인 시스템 비범위(05 §5). -->

## 변경 이력

| Version | Date | Author | Change |
|---|---|---|---|
| v0.1 | 2026-05-15 | yongtae.cho@bespinglobal.com | 초안 — 8 화면(7 라우트 + 404), Bootstrap 4 wireframe |

## 1. 화면 인벤토리

| ID | 화면명 | 진입 트리거 | F-ID 매핑 |
|---|---|---|---|
| S-01 | Home | `/` (항상). 익명: Global Feed만; 회원: Your Feed 탭 기본 | F-03, F-04, F-10 |
| S-02 | Sign In | `/login` (헤더 “Sign in” 또는 보호 라우트 가드 리다이렉트) | F-01, F-11 |
| S-03 | Sign Up | `/register` (헤더 “Sign up” 또는 Sign In 페이지 링크) | F-01 |
| S-04 | Settings | `/settings` (회원 헤더 “Settings”) | F-02 |
| S-05 | Editor (Create) | `/editor` (회원 헤더 “New Article”) | F-05 |
| S-06 | Editor (Edit) | `/editor/:slug` (Article 페이지 본인 글 “Edit” 버튼) | F-05 |
| S-07 | Article | `/article/:slug` (글 카드 클릭) | F-06, F-07, F-08, F-09 |
| S-08 | Profile | `/profile/:username[/favorites]` (글 카드 저자 클릭) | F-02, F-08 |

> 404 페이지(`*`)는 별도 S-ID 없이 RouterShell 안에서 정적 컴포넌트로 렌더. 사양은 명시하지 않음.

## 2. 화면 상세

### S-01: Home

- **목적**: 모든 사용자 진입점. Global Feed로 콘텐츠 발견, 회원은 Your Feed 큐레이션.
- **상태**: Anonymous(Your Feed 탭 미표시) / Authed(두 탭 + Your Feed 기본 활성).
- **F-ID 매핑**: F-03, F-04, F-10.
- **레이아웃 (Bootstrap 4 컨테이너)**:
  ```
  ┌─ Navbar (logo "conduit" / Home / Sign in·Sign up | New Article·Settings·@user) ─┐
  ├─ Banner (회원: 숨김 | 익명: "conduit — A place to share your knowledge.") ─────┤
  ├─ container ───────────────────────────────────────────────────────────────────┤
  │ col-md-9  Feed Tabs: [ Your Feed* ][ Global Feed ][ # tag (조건부) ]           │
  │           ArticleCard × N                                                      │
  │              ├ avatar · username · createdAt · ❤ favoritesCount                │
  │              ├ title (h1)                                                      │
  │              ├ description (p)                                                 │
  │              ├ "Read more..." + TagList                                         │
  │           Pagination (1 2 3 … last)                                            │
  │ col-md-3  Sidebar "Popular Tags" — Tag pill × N                                │
  └────────────────────────────────────────────────────────────────────────────────┘
  ```
- **상호작용**: 탭 클릭 → URL 쿼리 변경 + 새 fetch. 태그 클릭 → `#tag` 탭 push. ❤ 클릭(익명) → `/login?returnUrl=/`.
- **빈 상태**: Your Feed 팔로우 0건 → "팔로우하는 사용자가 없습니다. Global Feed에서 작가를 찾아보세요."
- **에러**: 글 fetch 실패 → 자리에 "글을 불러올 수 없습니다 · 재시도".

### S-02: Sign In

- **목적**: 가입 사용자 인증 → JWT 발급 + returnUrl 또는 `/`로 이동.
- **상태**: 입력 중 / 제출 중 / 오류.
- **F-ID 매핑**: F-01, F-11.
- **레이아웃**:
  ```
  ┌─ container ──────────────────────────┐
  │      <h1 class="text-xs-center">      │
  │            Sign in                    │
  │      <a href="/register">              │
  │       Need an account?                 │
  │      </a>                              │
  │      <ErrorList />                     │
  │      <form>                            │
  │       [ email      ]                   │
  │       [ password   ]                   │
  │       [ Sign in (btn-primary) ]        │
  └──────────────────────────────────────┘
  ```
- **상호작용**: Submit → POST `/api/users/login` → 200 시 AuthCtx.login + redirect to `returnUrl ?? '/'`.
- **에러 상태**: 422 → ErrorList ("email or password is invalid"). 401·5xx → 일반 메시지.

### S-03: Sign Up

- **목적**: 신규 사용자 가입 → 즉시 로그인 상태로 `/` 이동.
- **상태**: 입력 중 / 제출 중 / 오류.
- **F-ID 매핑**: F-01.
- **레이아웃**: Sign In과 동일 구조 + `username` 인풋 추가, "Have an account?" 링크.
- **에러 상태**: 422 errors의 모든 필드를 ErrorList로 펼침 (`username has already been taken` 등).

### S-04: Settings

- **목적**: 회원이 본인 image URL/이름/bio/email/password 변경 또는 로그아웃.
- **상태**: 로그인 필수. 미로그인 시 `/login?returnUrl=/settings`.
- **F-ID 매핑**: F-02.
- **레이아웃**:
  ```
  ┌─ container ─────────────────────────┐
  │      <h1>Your Settings</h1>          │
  │      <ErrorList />                    │
  │      <form>                           │
  │       [ URL of profile picture ]      │
  │       [ Your Name           ]         │
  │       [ Short bio (textarea)]         │
  │       [ Email               ]         │
  │       [ New Password        ]         │
  │       [ Update Settings (btn-primary)]│
  │      </form>                          │
  │      <hr/>                            │
  │      [ Or click here to logout ]      │
  └─────────────────────────────────────┘
  ```
- **상호작용**: Update → PUT `/api/user`. Logout → AuthCtx.logout + `/`.

### S-05: Editor (Create)

- **목적**: 회원이 새 글 작성·태그 입력·게시.
- **상태**: 로그인 필수. tag 입력 → Enter로 pill 추가.
- **F-ID 매핑**: F-05.
- **레이아웃**:
  ```
  ┌─ container ─────────────────────────┐
  │   <ErrorList />                      │
  │   <form>                             │
  │    [ Article Title                ]  │
  │    [ What's this article about?   ]  │
  │    [ Write your article (markdown)]  │
  │    [ Enter tags          ] (TagPill+) │
  │    [ Publish Article (btn-primary)]   │
  │   </form>                            │
  └─────────────────────────────────────┘
  ```
- **상호작용**: Publish → POST `/api/articles` → 200 시 navigate to `/article/:slug`.
- **에러 상태**: 422 errors의 모든 필드(title/description/body) ErrorList.

### S-06: Editor (Edit)

- **목적**: 본인 글 수정. S-05와 동일 폼이나 prefill.
- **상태**: 로그인 필수. 본인 글이 아니면 403 → "권한 없음" + Home 이동.
- **F-ID 매핑**: F-05.
- **레이아웃**: S-05와 동일. tagList는 readonly + 추가만 (사양 충실).
- **상호작용**: Save → PUT `/api/articles/:slug`. title 변경 시 slug 재생성 → 200 응답의 article.slug로 navigate.

### S-07: Article

- **목적**: 단일 글 상세 + 작가 액션(Follow/Favorite/Edit/Delete) + 댓글.
- **상태**: Anonymous(댓글 작성 폼 대신 “Sign in or sign up to add comments on this article.” 안내) / Authed(폼 노출 + 본인 댓글에 휴지통).
- **F-ID 매핑**: F-06, F-07, F-08, F-09.
- **레이아웃**:
  ```
  ┌─ Banner (dark) ─────────────────────────────────────┐
  │   <h1>Article Title</h1>                             │
  │   <ArticleMeta />                                    │
  │     avatar · username · createdAt · [Follow/Edit]    │
  │     [ ❤ Favorite (count) | Delete (own) ]            │
  └──────────────────────────────────────────────────────┘
  ┌─ container ──────────────────────────────────────────┐
  │   <div class="article-content">markdown→HTML</div>   │
  │   <TagList />                                         │
  │   <hr/>                                               │
  │   <ArticleMeta /> (반복)                              │
  │   <div class="row col-xs-12 col-md-8 offset-md-2">    │
  │     [ Authed: <CommentForm /> ]                       │
  │     [ Anon:   <Link to="/login">Sign in...</Link> ]   │
  │     <CommentItem /> × N (본인 댓글에 휴지통)            │
  └──────────────────────────────────────────────────────┘
  ```
- **상호작용**:
  - Follow/Unfollow → toggle (auth 필수).
  - Favorite/Unfavorite → 카운트 즉시 갱신 (낙관적 업데이트 + 실패 시 롤백).
  - Edit → `/editor/:slug` (본인만).
  - Delete → 확인 모달(브라우저 confirm) → DELETE → Home으로.
- **에러**: 404 slug → "글을 찾을 수 없습니다" 페이지. 본문 마크다운 렌더 시 DOMPurify로 `<script>` 등 위험 태그 제거 (R-F-18).

### S-08: Profile

- **목적**: 사용자 프로필 + 작성글 / 즐겨찾기 글.
- **상태**: 본인: "Edit Profile Settings" 버튼; 타인 + 인증: "Follow"; 타인 + 익명: "Follow" 클릭 시 `/login`으로.
- **F-ID 매핑**: F-02, F-08.
- **레이아웃**:
  ```
  ┌─ Banner (light) ────────────────────────────────────┐
  │      <img class="user-img" src="image"/>             │
  │      <h4>@username</h4>                              │
  │      <p>{bio}</p>                                    │
  │      [ Edit Profile Settings | Follow @username ]    │
  └──────────────────────────────────────────────────────┘
  ┌─ container ──────────────────────────────────────────┐
  │   Tabs: [ My Articles ][ Favorited Articles ]        │
  │   ArticleCard × N                                    │
  │   Pagination                                         │
  └──────────────────────────────────────────────────────┘
  ```
- **상호작용**: My Articles 탭 → `GET /api/articles?author=username`. Favorited 탭 → `?favorited=username`. 페이지네이션 → offset 갱신.

## 3. 디자인 시스템 / 토큰

- **디자인 시스템 자체 도입 비범위**(05 §5). RealWorld 공식 CSS(`bootstrap@4` + `~/styles/conduit.css` 또는 동등)을 그대로 import.
- **컴포넌트 매핑 예외**: 본 SPA는 Bootstrap의 JS 컴포넌트(Modal/Tooltip 등) 미사용. Reactive 컴포넌트는 React 12 자체 구현.
- **색상·간격 토큰**: Bootstrap 4 기본 변수 사용. 별도 `:root` 변수 미정의.

## 4. 접근성

- **키보드 내비**: 모든 폼은 `Tab` 순서 자연스럽게(label↔input pair). 버튼은 `Enter`/`Space`로 활성.
- **레이블**: `<label htmlFor>` 필수. ErrorList는 폼 상단에 `role="alert"`로 두어 스크린 리더가 즉시 인지.
- **포커스 표시**: Bootstrap 기본 outline 유지(커스텀 제거 금지).
- **컬러 컨트라스트**: Bootstrap 4 기본은 WCAG AA 충족. 커스텀 색 도입 시 별도 검증.
- **E2E 검증**: Playwright 1건 시나리오 — Home → Sign In(키보드만) → /editor → Publish (R-N-06).
- **비범위**: 스크린 리더 NVDA/VoiceOver 종합 시나리오, ARIA 깊이 있는 라벨링. (운영 단계 후속.)

## 5. Open Questions

- **OQ-D1** — 404 페이지 사양 미정의: 본 LLD는 RouterShell 안에 정적 "Page not found"로 결정. 운영 시 별도 화면 도입 가능.
- **OQ-D2** — Editor에서 마크다운 미리보기 탭 도입 여부: 비범위(03 OQ-S3, 04 OQ).
- **OQ-D3** — Settings의 password 필드 비움 시 미변경 처리 vs 빈 password로 변경 시도: 본 LLD는 “비움이면 변경 안 함” 채택 (사용자 친절). 11-coding-conventions에서 명문화.
- **OQ-D4** — Delete 확인 UX: 브라우저 `confirm()` vs Bootstrap Modal. 본 LLD는 `confirm()` 채택(JS 의존도 최소). 운영 단계 변경 가능.
