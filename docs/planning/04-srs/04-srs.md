---
doc_type: srs
version: v0.1 (Draft)
status: Draft
author: yongtae.cho@bespinglobal.com
date: 2026-05-15
gate: B
related:
  R-ID: []
  F-ID: []
  supersedes: null
---

# Conduit (RealWorld) — SRS

<!-- Gate B 본문. R-F-NN(기능) + R-N-NN(비기능). 각 R-ID는 3축(단위/통합/E2E) 결정 + Happy + Failure 시나리오 BLOCK (schema/ADR-0023/ADR-0014). -->

## 변경 이력

| Version | Date | Author | Change |
|---|---|---|---|
| v0.1 | 2026-05-15 | yongtae.cho@bespinglobal.com | 초안 — 19 R-F + 6 R-N, 3축·Happy/Failure 정렬 |

## 1. 범위 / 가정

- **사양 정본** — RealWorld 공식 사양(`https://realworld-docs.netlify.app/`). 본 SRS와 사양이 충돌 시 사양 우선.
- **In Scope** — FE 7 라우트(`/`, `/login`, `/register`, `/settings`, `/editor`, `/editor/:slug`, `/article/:slug`, `/profile/:username`, `/profile/:username/favorites`), BE 19 엔드포인트, 5 엔티티(User·Article·Comment·Tag·Follow/Favorite 관계), JWT 인증.
- **Out of Scope** — 브리프 §5 비목표 일체(OAuth/MFA/검색/i18n/이미지 업로드/관리자/CMS 워크플로우).
- **가정**:
  - JWT 헤더 형식은 `Authorization: Token <jwt>` (사양 명시) — Bearer 불가.
  - 응답 Content-Type: `application/json; charset=utf-8`.
  - 페이지네이션 기본 limit=20, 최대 limit=100 (사양 default + 본 SRS 보수적 제한).
  - 슬러그 생성: `kebab-case(title)`; 충돌 시 `-<6자 base36 해시>` suffix.
  - JWT 만료(exp) = 24h, refresh 없음(사양 외).
  - 글/댓글 정렬 = `createdAt DESC`.
  - 단일 인스턴스 + 단일 RDB. 동시성은 단순 트랜잭션 + unique 제약으로 처리.
- **공통 오류 페이로드** — `{ "errors": { "<field|body>": ["<msg>", ...] } }` (사양). HTTP 401/403/404/422 만 사용.

## 2. 기능 요구사항

### R-F-01: 회원가입 (POST /api/users)

- 우선순위: P0
- 요약: username/email/password로 회원 생성. 200 시 JWT 포함 user 반환.
- Acceptance: Given 미가입 신규 방문자 When `POST /api/users {user:{username,email,password}}` 호출 Then 200 + `user{email,token,username,bio:"",image:null}` 반환 + 동일 username/email 재가입 시 422 거부.
- 테스트 시나리오:
  - 단위: ✅ 비밀번호 해싱 함수(bcrypt cost ≥ 10), email 정규식, username 길이/문자 검증.
  - 통합: ✅ 실 DB에 user insert + unique 제약(username/email) 충돌 케이스.
  - E2E: ✅ `/register` 폼 → 가입 성공 → 헤더에 username 노출.
  - Happy(정상): 신규 username/email로 가입 → 200 + JWT.
  - Failure(실패): 이메일 형식 위반/필수 누락 → 422 `errors.email`. 중복 username → 422 `errors.username:["has already been taken"]`.

### R-F-02: 로그인 (POST /api/users/login)

- 우선순위: P0
- 요약: email/password 인증 후 JWT 발급.
- Acceptance: Given 가입된 사용자 When 정확한 자격증명으로 `POST /api/users/login` Then 200 + user JSON + JWT(`exp`=24h). 자격증명 불일치 시 422.
- 테스트 시나리오:
  - 단위: ✅ 비밀번호 검증(bcrypt compare), JWT 서명 함수.
  - 통합: ✅ 실 DB에 가입된 사용자로 로그인 시도 + 잘못된 password.
  - E2E: ✅ `/login` 폼 → 성공 시 `/`로 이동 + 헤더 username.
  - Happy: 올바른 자격증명 → 200 + JWT.
  - Failure(에러): 잘못된 password → 422 `errors.["email or password"]`. 미가입 email → 422 동일 메시지(사용자 존재성 노출 방지).

### R-F-03: 현재 사용자 조회·갱신 (GET/PUT /api/user)

- 우선순위: P0
- 요약: JWT 보유자 본인 정보 조회/수정.
- Acceptance: Given 유효 JWT When `GET /api/user` Then 200 + 본인 user. `PUT /api/user {user:{email?,username?,password?,image?,bio?}}` 부분 변경 200. 무인증 시 401.
- 테스트 시나리오:
  - 단위: ✅ partial-update 필드 화이트리스트, password 변경 시 재해싱.
  - 통합: ✅ JWT 인증 미들웨어 + 부분 갱신 + email/username unique 위반.
  - E2E: ✅ `/settings` → bio 변경 → 글 카드의 저자 정보 갱신 확인.
  - Happy(정상): bio·image 갱신 → 200 + 갱신된 user.
  - Failure(거부): 만료 JWT → 401. 다른 사용자의 email로 변경 → 422.

### R-F-04: 프로필 조회 (GET /api/profiles/:username)

- 우선순위: P0
- 요약: username으로 공개 프로필 + following 플래그 반환.
- Acceptance: Given 임의 사용자 When `GET /api/profiles/:username` Then 200 + `profile{username,bio,image,following}`. 인증 없으면 `following=false`.
- 테스트 시나리오:
  - 단위: ✅ following 플래그 계산(viewer follows target).
  - 통합: ✅ 익명/인증 양쪽 모두 조회 + 미존재 username → 404.
  - E2E: ✅ `/profile/:username` 진입 시 프로필 + 작성글 탭 렌더.
  - Happy: 존재 사용자 조회 → 200 + 정확한 following.
  - Failure: 미존재 username → 404 `errors.body:["profile not found"]`.

### R-F-05: 팔로우/언팔로우 (POST/DELETE /api/profiles/:username/follow)

- 우선순위: P0
- 요약: 인증 사용자가 대상 사용자를 팔로우/해제.
- Acceptance: Given 인증된 viewer ≠ target When `POST .../follow` Then 200 + `profile{following:true}`. `DELETE` Then `following:false`. 본인 자신 팔로우 시 422.
- 테스트 시나리오:
  - 단위: ✅ self-follow 거절 검증 함수, follow uniqueness 결정.
  - 통합: ✅ POST 후 GET profile 의 following=true; DELETE 후 false; 중복 POST는 idempotent(여전히 true).
  - E2E: ✅ `/profile/:username` Follow 클릭 → 버튼 상태 갱신 → Home Your Feed에 글 포함.
  - Happy(성공): 첫 팔로우 → 200 + following=true.
  - Failure(예외): 본인 자신 팔로우 → 422 `errors.body:["cannot follow yourself"]`. 미존재 username → 404. 무인증 → 401.

### R-F-06: 글 목록 필터 (GET /api/articles)

- 우선순위: P0
- 요약: 글 목록을 `tag`/`author`/`favorited`/`limit`/`offset`로 필터·페이지네이션.
- Acceptance: Given 글 N건 When `GET /api/articles?tag=foo&limit=10&offset=0` Then 200 + `{articles:[...], articlesCount:total}`. limit 기본 20, 최대 100; 초과 시 422.
- 테스트 시나리오:
  - 단위: ✅ 쿼리 파라미터 파서 (limit/offset 정수 검증, 음수/큰값 거절).
  - 통합: ✅ tag/author/favorited 조합 + 정렬(createdAt DESC) + count 정확성.
  - E2E: ✅ Home Global Feed에서 태그 클릭 → URL 쿼리 적용 → 카드 필터.
  - Happy: tag=foo로 조회 → foo 태그 글만 반환, articlesCount 일치.
  - Failure(에러): limit=999 → 422 `errors.limit:["must be ≤100"]`. 잘못된 offset(음수) → 422.

### R-F-07: Your Feed (GET /api/articles/feed)

- 우선순위: P0
- 요약: 인증 사용자가 팔로우한 작가의 글만.
- Acceptance: Given 인증된 사용자 + 팔로우 N건 When `GET /api/articles/feed?limit&offset` Then 200 + 해당 사용자가 팔로우한 작가의 글만.
- 테스트 시나리오:
  - 단위: ✅ feed 쿼리 빌더(IN-subquery on follows).
  - 통합: ✅ 팔로우 0건 → 빈 배열 + articlesCount=0; 팔로우 추가 후 즉시 포함.
  - E2E: ✅ `/` 진입 시 Your Feed 탭 기본 활성 → 팔로우한 작가 글만.
  - Happy: 팔로우한 작가 글이 최신순 반환.
  - Failure: 무인증 → 401. (피드는 익명 비허용.)

### R-F-08: 글 상세 (GET /api/articles/:slug)

- 우선순위: P0
- 요약: slug로 단일 글 + 저자 + 태그 + favorited/favoritesCount 반환.
- Acceptance: Given 존재 slug When `GET /api/articles/:slug` Then 200 + 전체 article(body 포함). 인증 헤더 있으면 favorited/following 정확 계산.
- 테스트 시나리오:
  - 단위: ✅ favorited 플래그 계산.
  - 통합: ✅ 인증/익명 둘 다 200 + 미존재 slug → 404.
  - E2E: ✅ `/article/:slug` 라우트 진입 시 본문 마크다운 렌더.
  - Happy: 존재 slug → 200 + 정확한 body.
  - Failure(에러): 미존재 slug → 404. 삭제된 slug → 404.

### R-F-09: 글 작성 (POST /api/articles)

- 우선순위: P0
- 요약: title/description/body/tagList 입력. slug 자동 생성.
- Acceptance: Given 인증 사용자 When `POST /api/articles {article:{title,description,body,tagList?}}` Then 201/200 + article(slug 포함). title/description/body 누락 시 422.
- 테스트 시나리오:
  - 단위: ✅ slug 생성기(title→kebab + 충돌 시 hash suffix), tagList dedup.
  - 통합: ✅ Article + Tag 다대다 삽입 + 슬러그 충돌 케이스(같은 title 2회 작성).
  - E2E: ✅ `/editor` → Publish → `/article/:slug` 리다이렉트 + 본문 표시.
  - Happy(정상): 정상 입력 → 200 + slug 생성.
  - Failure(거부): title 빈 값 → 422 `errors.title:["can't be empty"]`. 무인증 → 401.

### R-F-10: 글 수정 (PUT /api/articles/:slug)

- 우선순위: P0
- 요약: 본인 글만 수정. title 변경 시 slug 재생성 여부 결정.
- Acceptance: Given 본인 글 보유 사용자 When `PUT /api/articles/:slug {article:{title?,description?,body?}}` Then 200 + 갱신 article. **본 사양: title 변경 시 slug 재생성**(이전 slug 무효).
- 테스트 시나리오:
  - 단위: ✅ 부분 갱신 화이트리스트, slug 재생성 트리거.
  - 통합: ✅ 본인 글 PUT 200 + 타인 글 PUT 403 + 미존재 slug 404.
  - E2E: ✅ `/editor/:slug` 진입 prefill → 변경 → 저장 후 글 페이지 갱신.
  - Happy(성공): description만 변경 → 200.
  - Failure(예외): 타인 글 변경 → 403 `errors.body:["forbidden"]`. 미존재 slug → 404.

### R-F-11: 글 삭제 (DELETE /api/articles/:slug)

- 우선순위: P0
- 요약: 본인 글만 삭제. 댓글·즐겨찾기 cascade.
- Acceptance: Given 본인 글 When `DELETE /api/articles/:slug` Then 200/204 + 후속 GET 404. 타인 글 → 403.
- 테스트 시나리오:
  - 단위: ✅ 권한 가드 함수(article.author == viewer).
  - 통합: ✅ 삭제 후 GET 404 + 연관 Comment·Favorite 행도 제거(cascade).
  - E2E: ✅ Article 페이지 Delete → 홈으로 + 목록에서 제거.
  - Happy: 본인 글 삭제 → 200.
  - Failure(거부): 타인 글 삭제 → 403. 미존재 → 404. 무인증 → 401.

### R-F-12: 즐겨찾기 토글 (POST/DELETE /api/articles/:slug/favorite)

- 우선순위: P0
- 요약: 인증 사용자가 글 좋아요/해제. favoritesCount 동기 갱신.
- Acceptance: Given 인증 사용자 + 존재 slug When `POST .../favorite` Then 200 + article(favorited=true, favoritesCount +1). 다시 POST는 idempotent. `DELETE`는 반대.
- 테스트 시나리오:
  - 단위: ✅ 중복 favorite 처리(unique constraint).
  - 통합: ✅ POST→GET 일관성 + 동일 사용자 중복 POST 카운트 1회만 증가.
  - E2E: ✅ Home/Article에서 ❤ 토글 + 카운트 갱신.
  - Happy(정상): 첫 즐겨찾기 → favoritesCount +1.
  - Failure(에러): 미존재 slug → 404. 무인증 → 401.

### R-F-13: 댓글 목록 (GET /api/articles/:slug/comments)

- 우선순위: P0
- 요약: 글의 댓글 전부 반환.
- Acceptance: Given 존재 slug When `GET .../comments` Then 200 + `{comments:[{id,createdAt,updatedAt,body,author}]}`. 미존재 slug → 404.
- 테스트 시나리오:
  - 단위: ✅ 댓글 직렬화(저자 following 플래그 포함).
  - 통합: ✅ 댓글 N건 정렬 + 인증/익명 차이(following 필드).
  - E2E: ✅ `/article/:slug` 페이지 하단에 댓글 N건 렌더.
  - Happy: 댓글 0~N건 정상 반환.
  - Failure: 미존재 slug → 404.

### R-F-14: 댓글 작성 (POST /api/articles/:slug/comments)

- 우선순위: P0
- 요약: 인증 사용자가 글에 댓글 추가.
- Acceptance: Given 인증 사용자 When `POST .../comments {comment:{body}}` Then 200 + 새 comment 반환(id 부여, author=본인).
- 테스트 시나리오:
  - 단위: ✅ body 길이 검증(1..N).
  - 통합: ✅ 작성 후 GET 목록에 포함.
  - E2E: ✅ Article 페이지 댓글 폼 → 작성 후 목록에 즉시 표시.
  - Happy(성공): 정상 body → 200.
  - Failure(에러): 빈 body → 422 `errors.body:["can't be empty"]`. 무인증 → 401. 미존재 slug → 404.

### R-F-15: 댓글 삭제 (DELETE /api/articles/:slug/comments/:id)

- 우선순위: P0
- 요약: 본인 댓글만 삭제.
- Acceptance: Given 본인 댓글 When `DELETE` Then 200/204. 타인 댓글 → 403.
- 테스트 시나리오:
  - 단위: ✅ 권한 가드(comment.author == viewer).
  - 통합: ✅ 삭제 후 목록에서 제거.
  - E2E: ✅ 본인 댓글 옆 휴지통 클릭 → 즉시 제거.
  - Happy: 본인 댓글 삭제 → 200.
  - Failure(거부): 타인 댓글 → 403. 미존재 id → 404. 무인증 → 401.

### R-F-16: 태그 목록 (GET /api/tags)

- 우선순위: P1
- 요약: 인기/전체 태그 문자열 배열 반환.
- Acceptance: Given 글 N건의 태그 풀 When `GET /api/tags` Then 200 + `{tags:[<str>...]}`. 인증 불필요.
- 테스트 시나리오:
  - 단위: ✅ DISTINCT 태그 집계 함수.
  - 통합: ✅ 글 0건 시 빈 배열, 글 N건 시 unique 태그.
  - E2E: ✅ Home 사이드바 Popular Tags 렌더.
  - Happy(정상): 태그 N건 반환.
  - Failure(에러): DB 오류 → 5xx + 토스트. (사양 외이므로 N/A 처리 가능하나 안전망으로 명시.)

### R-F-17: FE 라우팅 (SPA 7 라우트)

- 우선순위: P0
- 요약: `/`, `/login`, `/register`, `/settings`, `/editor[/:slug]`, `/article/:slug`, `/profile/:username[/favorites]` 라우트 정의 + 보호 라우트 처리.
- Acceptance: Given 익명 사용자 When 보호 라우트(`/settings`, `/editor*`) 진입 Then `/login`으로 리다이렉트 + 쿼리 `?returnUrl=...` 부착. 로그인 성공 시 returnUrl로 복귀.
- 테스트 시나리오:
  - 단위: ✅ 라우트 가드 함수(요구 권한 vs 현재 토큰), URL 빌더.
  - 통합: N/A (FE 단독 동작 — BE 미관여).
  - E2E: ✅ 익명 `/settings` 진입 → `/login?returnUrl=/settings` → 로그인 → `/settings` 복귀.
  - Happy(정상): 회원 사용자 모든 라우트 직접 접근 OK.
  - Failure(거부): 익명 사용자 `/editor` → `/login`으로.

### R-F-18: 마크다운 렌더

- 우선순위: P0
- 요약: Article body는 마크다운으로 입력, 상세 페이지에서 안전 렌더(HTML 산화 방지).
- Acceptance: Given Markdown body When 상세 페이지 렌더 Then 헤딩/리스트/코드/링크가 HTML로 변환되어 표시 + `<script>` 등 위험 태그 제거.
- 테스트 시나리오:
  - 단위: ✅ 마크다운→HTML 변환 + sanitizer 화이트리스트.
  - 통합: N/A (BE 미관여).
  - E2E: ✅ `**bold**` 입력 → 상세에서 굵게 렌더.
  - Happy(성공): 기본 마크다운 문법 정상 렌더.
  - Failure(예외): 악성 `<script>alert(1)</script>` 입력 → 렌더 결과에 실행되지 않음(sanitizer가 제거).

### R-F-19: 페이지네이션 UI

- 우선순위: P1
- 요약: Home/Profile/Feed에 페이지네이션 버튼. limit=20 고정, offset 변경.
- Acceptance: Given 글 30건 When Home 진입 Then 1·2 페이지 버튼 노출. 2 클릭 → offset=20 글 표시. 1건도 없으면 빈 상태 메시지.
- 테스트 시나리오:
  - 단위: ✅ 페이지 수 계산(`ceil(articlesCount / limit)`).
  - 통합: N/A.
  - E2E: ✅ 30건 시 2페이지 보임, 클릭 시 다른 글 표시.
  - Happy: 페이지 클릭 → URL ?offset=20 변경 + 다른 글.
  - Failure(에러): 0건 시 “No articles are here... yet.” 안내. 너무 큰 offset → 빈 목록.

## 3. 비기능 요구사항

### R-N-01: 표준 RealWorld 사양 적합도

- 우선순위: P0
- 요약: 공식 Postman Collection 전 케이스가 본 BE에 대해 PASS.
- Acceptance: Given 공식 Postman 컬렉션 When Newman 실행 Then 모든 케이스 PASS, 실패 0건. 실패 시 PR 머지 차단.
- 테스트 시나리오:
  - 단위: N/A (외부 테스트 도구로 검증).
  - 통합: ✅ Newman을 CI에서 실행(테스트 DB·테스트 사용자 1세트).
  - E2E: N/A (API 검증).
  - Happy(성공): 23개 케이스 PASS.
  - Failure(실패): 어느 1건이라도 실패 → 머지 차단 + 원인 R-ID 매핑 후 패치.

### R-N-02: 인증/세션 보안

- 우선순위: P0
- 요약: JWT는 `Authorization: Token <jwt>`로만 전송. exp=24h. 비밀번호는 bcrypt(cost≥10).
- Acceptance: Given 보호 엔드포인트 When JWT 없음/만료/위조 Then 401 `errors.body:["unauthorized"]`. Bearer prefix는 거절(사양 충실).
- 테스트 시나리오:
  - 단위: ✅ JWT 서명/검증·만료 함수, bcrypt 해시·비교.
  - 통합: ✅ 보호 엔드포인트 401 케이스 전부 + 만료 토큰.
  - E2E: ✅ 만료된 JWT 보유자 보호 페이지 진입 → `/login` 리다이렉트.
  - Happy: 유효 JWT → 200.
  - Failure(에러): 위조 JWT → 401. Bearer prefix → 401.

### R-N-03: 표준 오류 응답

- 우선순위: P0
- 요약: 모든 오류는 `{errors:{<key>:[<msg>...]}}` 형식 + HTTP 401/403/404/422만 사용.
- Acceptance: Given 임의 실패 케이스 When 응답 Then 위 구조 + 적정 status.
- 테스트 시나리오:
  - 단위: ✅ 오류 직렬화 미들웨어.
  - 통합: ✅ 19 엔드포인트 각각의 실패 케이스에서 구조 일관.
  - E2E: N/A (BE 응답 형식 검증).
  - Happy(정상): 정상 케이스는 본 룰 미적용.
  - Failure(에러): 모든 422/401/403/404가 동일 구조. 5xx는 일반 메시지 1행.

### R-N-04: 데이터 무결성 (Unique·Cascade·Slug)

- 우선순위: P0
- 요약: username·email·slug unique. Article 삭제 시 Comment/Favorite cascade. User 삭제는 비범위.
- Acceptance: Given 동일 username 2회 가입 시도 When 두 번째 commit Then DB unique 위반 + 422. Article 삭제 시 자식 행 0건 남음.
- 테스트 시나리오:
  - 단위: ✅ slug uniqueness 검증, cascade 옵션 결정.
  - 통합: ✅ 동시 가입 race 시 한쪽만 성공 + 다른 쪽 422. Article 삭제 후 자식 행 0.
  - E2E: N/A.
  - Happy: 정상 입력 → 1행 생성.
  - Failure(에러): unique 충돌 → 422. 외래키 위반 → 422 또는 404(미존재 참조).

### R-N-05: 성능 SLO

- 우선순위: P1
- 요약: 단일 인스턴스 + 동시 20 RPS 부하에서 p95 응답 < 300ms (BE).
- Acceptance: Given dev 환경 부하 테스트 When 5분 20 RPS Then p95 < 300ms + 5xx 0건.
- 테스트 시나리오:
  - 단위: N/A.
  - 통합: ✅ k6/Newman 부하 스크립트(옵션, 운영 단계로 deferral 가능).
  - E2E: N/A.
  - Happy(성공): SLO 충족.
  - Failure(실패): SLO 초과 시 14 WBS에 성능 이슈 등록 + ADR 보고.

### R-N-06: 접근성·브라우저 지원

- 우선순위: P2
- 요약: 최신 Chrome/Firefox/Safari 1세대 + Bootstrap 4 기본 a11y(키보드 포커스/라벨) 유지.
- Acceptance: Given 최신 Chrome When 7개 라우트 키보드 탭 이동 Then 모든 폼·버튼 포커스 도달.
- 테스트 시나리오:
  - 단위: N/A.
  - 통합: N/A.
  - E2E: ✅ `/qa` 키보드 내비 시나리오 1회.
  - Happy(정상): 키보드만으로 로그인→글 작성 가능.
  - Failure(예외): 포커스 트랩/누락 시 14 리스크 등록 + 이슈화.

## 4. 인터페이스 요구사항

- **API Base URL**: `${BACKEND_BASE}/api` (스택 확정은 06 Architecture).
- **헤더**:
  - 요청: `Authorization: Token <jwt>` (보호 엔드포인트).
  - 응답: `Content-Type: application/json; charset=utf-8`.
- **공통 응답 래퍼**:
  - 단일 user → `{user:{...}}`
  - 단일 profile → `{profile:{...}}`
  - 단일 article → `{article:{...}}`
  - 목록 articles → `{articles:[...], articlesCount:N}` (개별 객체에 `body` 제외, 2024/08 사양)
  - 댓글 → 단일 `{comment:{...}}`, 목록 `{comments:[...]}`
  - 태그 → `{tags:[<str>...]}`
- **CORS**: 동일 출처 + FE Origin 화이트리스트. preflight `OPTIONS` 허용.
- **로깅**: 요청별 traceId 부여 + 401/403/404/422 카운터(운영 대시보드 정본은 운영 단계로 deferral).

## 5. 도메인 모델

```
User (id, username UNIQUE, email UNIQUE, password_hash, bio, image, created_at, updated_at)
Article (id, slug UNIQUE, title, description, body, author_id FK→User, created_at, updated_at)
Tag (id, name UNIQUE)
ArticleTag (article_id FK, tag_id FK)  -- M:N
Comment (id, article_id FK→Article, author_id FK→User, body, created_at, updated_at)
Favorite (user_id FK, article_id FK)   -- M:N, PK=(user_id, article_id)
Follow   (follower_id FK→User, followee_id FK→User)  -- M:N, PK=(follower_id, followee_id)
```

- favoritesCount = COUNT(Favorite WHERE article_id).
- following = EXISTS(Follow WHERE follower_id=viewer AND followee_id=target).
- 상세 DDL·인덱스는 09 API Spec / 10 DB(LLD) 단계에서 확정.

## 6. Open Questions

- **OQ-01** — slug 정책(R-F-09/R-F-10): title 변경 시 “재생성”이 사양에 명시 없음. 본 SRS는 ‘재생성 + 이전 slug 무효’로 가정(브리프 O-02 정합). 운영 단계에서 “이전 slug 영구 redirect”로 보강 가능.
- **OQ-02** — 자기 자신 팔로우(R-F-05): 422 채택(사양은 모호). Postman 컬렉션 결과로 최종 확정.
- **OQ-03** — 페이지네이션 max limit(R-F-06): 100 채택. 사양에는 default 20만 있음. PRD/HLD에서 합의.
- **OQ-04** — JWT 갱신(R-N-02): refresh token 없음. 만료 시 재로그인. 운영 시 사용자 불편할 경우 운영 단계 ADR로 변경.
- **OQ-05** — 5xx 응답 표준(R-N-03): RealWorld 사양은 5xx를 명시하지 않음. 본 SRS는 `{errors:{body:["internal server error"]}}` + 로그 traceId.
