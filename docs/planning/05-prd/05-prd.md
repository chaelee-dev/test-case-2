---
doc_type: prd
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

# Conduit (RealWorld) — PRD

<!-- Gate B 본문. F-NN 기능 + MVP Cut + R-ID 매핑 + 3축·Happy/Failure 시나리오 BLOCK. -->

## 변경 이력

| Version | Date | Author | Change |
|---|---|---|---|
| v0.1 | 2026-05-15 | yongtae.cho@bespinglobal.com | 초안 — 11 F-ID, R-F-01~19/R-N-01~06 매핑 |

## 1. 제품 개요

- **제품명**: Conduit (코드네임 동일, RealWorld 공식 사양 채택).
- **카테고리**: 마크다운 블로깅 SPA + REST API.
- **사양 정본**: `https://realworld-docs.netlify.app/`. UI 템플릿(Bootstrap 4) + API 사양 둘 다 적합 대상.
- **사용 가능 상태(MVP)**: 7 라우트 골든패스 + 19 API 엔드포인트 + Postman 적합 100%.

## 2. 사용자 가치

- **익명 독자(P1, 03 §1)**: 가입 없이 인기 글·태그를 빠르게 둘러보기.
- **회원 작가(P2/P3)**: 마크다운으로 글을 빠르게 쓰고 즉시 공개, 즐겨찾기/댓글로 피드백 확인.
- **큐레이터(P4)**: 팔로우한 작가의 글만 모은 “Your Feed”로 시그널-노이즈 분리.
- **사내(이해관계자)**: 우리 스택의 풀스택 dogfood + DevToolKit 1회 완주 reference.

## 3. 기능

### F-01: 인증 (회원가입·로그인·세션)

- MVP Cut: ✅ 포함
- 우선순위: P0
- 사용자 스토리: As a 비회원 방문자, I want 이메일·비밀번호로 가입·로그인하기, so that 글 작성·팔로우·댓글을 사용할 수 있다.
- Acceptance: Given 미가입 방문자 When `/register` 폼 제출 Then 200 + JWT 발급 + 헤더에 username 노출. Given 가입자 When `/login` 정확 자격증명 Then 200 + 직전 의도 경로(returnUrl) 또는 `/`로 이동. 만료 JWT → 401 → `/login`.
- R-ID 매핑: R-F-01, R-F-02, R-F-03, R-N-02
- 테스트 시나리오:
  - 단위: ✅ 비밀번호 해싱·JWT 서명·email 정규식.
  - 통합: ✅ 가입/로그인/`/api/user` 엔드포인트 PASS.
  - E2E: ✅ `/register` → `/login` → 헤더 username 표시 골든패스.
  - Happy(정상): 신규 가입 → 즉시 로그인 상태 + 본인 username.
  - Failure(에러): 중복 username → 422. 잘못된 password → 422. 만료 JWT 보호 페이지 진입 → `/login` 리다이렉트.

### F-02: 사용자 프로필 (조회·설정)

- MVP Cut: ✅ 포함
- 우선순위: P0
- 사용자 스토리: As a 회원, I want 내 image/이름/bio/email/password를 갱신하고 타인의 프로필을 보기, so that 정체성을 표현하고 작가를 발견할 수 있다.
- Acceptance: Given 인증 사용자 When `/settings`에서 일부 필드 변경 Then 200 + 즉시 다른 화면(예: 글 카드)에 반영. Given 임의 사용자 When `/profile/:username` 진입 Then 프로필 + 작성글 탭 + 즐겨찾기 글 탭.
- R-ID 매핑: R-F-03, R-F-04
- 테스트 시나리오:
  - 단위: ✅ partial-update 필드 화이트리스트.
  - 통합: ✅ `PUT /api/user` 부분 갱신 + 중복 email 422.
  - E2E: ✅ `/settings` bio 변경 → 글 카드 저자 정보 갱신.
  - Happy(성공): bio 변경 → 모든 카드 갱신.
  - Failure(거부): 만료 JWT → 401. 다른 사용자의 email로 변경 → 422.

### F-03: 글 발견 (Home Global Feed + Tag 필터 + 페이지네이션)

- MVP Cut: ✅ 포함
- 우선순위: P0
- 사용자 스토리: As a 익명/회원 사용자, I want Global Feed에서 글을 둘러보고 태그 클릭으로 필터링하고 페이지를 넘기기, so that 관심 글을 빠르게 찾는다.
- Acceptance: Given Home 진입 When Global Feed 탭 클릭 Then 최신 20건 글 카드 렌더(저자/날짜/즐겨찾기수/제목/요약/태그) + 사이드바 Popular Tags + 페이지네이션. 태그 클릭 시 `#태그` 탭 생성·활성.
- R-ID 매핑: R-F-06, R-F-16, R-F-19
- 테스트 시나리오:
  - 단위: ✅ 쿼리 파라미터 파서, 페이지 수 계산 함수.
  - 통합: ✅ `GET /api/articles?tag=...&limit=&offset=` + `GET /api/tags`.
  - E2E: ✅ 익명 사용자 Home → Global Feed → 태그 클릭 → 필터 적용.
  - Happy(정상): 태그 필터 적용 시 해당 태그 글만.
  - Failure(에러): limit=999 → 422. 글 0건 시 “No articles are here... yet.” 안내.

### F-04: Your Feed (팔로우 기반)

- MVP Cut: ✅ 포함
- 우선순위: P0
- 사용자 스토리: As a 회원, I want 팔로우한 작가의 글만 모은 피드를 보기, so that 관심 있는 작가의 글에 집중한다.
- Acceptance: Given 인증 사용자 When `/` 진입 Then “Your Feed” 탭 기본 활성 + 팔로우한 작가 글만. 팔로우 0건이면 “팔로우하는 사용자가 없습니다” 빈 상태 + Global Feed로 이동 CTA.
- R-ID 매핑: R-F-07
- 테스트 시나리오:
  - 단위: ✅ feed 쿼리 빌더(IN-subquery on follows).
  - 통합: ✅ 팔로우 0건 → 빈 배열; 팔로우 추가 즉시 포함.
  - E2E: ✅ A 사용자가 B를 팔로우 → B 글 작성 → A의 Your Feed에 즉시 표시.
  - Happy(성공): 팔로우한 작가 글 정렬 정확.
  - Failure(예외): 무인증 진입 → 401 → `/login`.

### F-05: 글 작성·수정·삭제 (Editor)

- MVP Cut: ✅ 포함
- 우선순위: P0
- 사용자 스토리: As a 회원 작가, I want title/description/body(Markdown)/tagList로 글을 작성·수정·삭제하기, so that 본인 콘텐츠를 발행·관리한다.
- Acceptance: Given 인증 사용자 When `/editor`에서 Publish Then 슬러그 발급 + `/article/:slug` 이동. Edit 시 prefill → 부분 갱신. Delete 시 홈 이동 + 목록 제거.
- R-ID 매핑: R-F-09, R-F-10, R-F-11
- 테스트 시나리오:
  - 단위: ✅ slug 생성기·tag dedup·부분 갱신 화이트리스트.
  - 통합: ✅ POST→PUT→DELETE 라이프사이클 + 권한 가드.
  - E2E: ✅ `/editor` → Publish → 글 페이지 표시 → Edit → 저장 → Delete → 홈.
  - Happy(정상): 정상 입력 → 200 + slug.
  - Failure(거부): title 빈 값 → 422. 타인 글 PUT/DELETE → 403. 미존재 → 404. 무인증 → 401.

### F-06: 글 상세 + 마크다운 렌더

- MVP Cut: ✅ 포함
- 우선순위: P0
- 사용자 스토리: As a 사용자, I want 글의 본문을 마크다운으로 안전하게 렌더해서 보기, so that 작가 의도대로 가독성 좋게 읽는다.
- Acceptance: Given Article 페이지 When 진입 Then 배너(저자/날짜/액션 버튼) + 마크다운 본문(헤딩/리스트/코드/링크 변환) + 태그 + 댓글 폼·목록. 익명 시 댓글 폼 대신 “로그인하여 댓글 작성” 링크.
- R-ID 매핑: R-F-08, R-F-13, R-F-18, R-N-03
- 테스트 시나리오:
  - 단위: ✅ 마크다운 변환 + sanitizer(`<script>` 제거).
  - 통합: ✅ `GET /api/articles/:slug` + `/comments`. 미존재 slug → 404.
  - E2E: ✅ `**bold**` 입력 후 글 페이지에서 굵게 렌더 + `<script>` 입력해도 실행 안 됨.
  - Happy(성공): 일반 마크다운 정상 렌더.
  - Failure(예외): 악성 스크립트 → sanitizer가 제거(XSS 방어). 미존재 slug → 404 페이지.

### F-07: 즐겨찾기 (Favorite)

- MVP Cut: ✅ 포함
- 우선순위: P0
- 사용자 스토리: As a 회원, I want 글을 즐겨찾기·해제하고 내 즐겨찾기 목록을 보기, so that 좋은 글을 다시 찾을 수 있다.
- Acceptance: Given 인증 사용자 When ❤ 클릭 Then favoritesCount +1 + favorited=true; 다시 클릭 시 -1. `/profile/:username/favorites` 진입 시 해당 사용자의 즐겨찾기 글 목록.
- R-ID 매핑: R-F-12, R-F-06(`favorited=` 쿼리)
- 테스트 시나리오:
  - 단위: ✅ 중복 favorite 처리(unique).
  - 통합: ✅ POST→GET 일관성, 중복 POST idempotent.
  - E2E: ✅ Home에서 ❤ 토글 + 카운트 갱신 + 본인 favorites 탭에 글 표시.
  - Happy(정상): 첫 즐겨찾기 → 카운트 +1.
  - Failure(에러): 미존재 slug → 404. 익명 사용자 클릭 → `/login`으로.

### F-08: 팔로우 (Follow)

- MVP Cut: ✅ 포함
- 우선순위: P0
- 사용자 스토리: As a 회원, I want 다른 작가를 팔로우·언팔로우하기, so that Your Feed로 관심 작가의 글만 본다.
- Acceptance: Given 인증 사용자 + 본인 ≠ 대상 When `/profile/:username`에서 Follow 클릭 Then following=true + Your Feed에 글 포함. 본인 자신 팔로우 시 422.
- R-ID 매핑: R-F-05, R-F-07
- 테스트 시나리오:
  - 단위: ✅ self-follow 거절.
  - 통합: ✅ POST/DELETE 후 GET profile 의 following 상태 정합.
  - E2E: ✅ A → B 팔로우 → A의 Your Feed에 B 글 표시.
  - Happy(성공): 첫 팔로우 → 200 + following=true.
  - Failure(예외): 본인 자신 팔로우 → 422. 미존재 username → 404. 무인증 → 401.

### F-09: 댓글 (작성·삭제·열람)

- MVP Cut: ✅ 포함
- 우선순위: P0
- 사용자 스토리: As a 회원, I want 글에 댓글을 작성·삭제하기, so that 작가와 다른 독자와 대화한다.
- Acceptance: Given 인증 사용자 + Article 페이지 When 댓글 폼에 본문 입력·제출 Then 200 + 목록에 즉시 표시. 본인 댓글 우측 휴지통 클릭 시 즉시 제거.
- R-ID 매핑: R-F-13, R-F-14, R-F-15
- 테스트 시나리오:
  - 단위: ✅ body 길이 검증, 권한 가드.
  - 통합: ✅ POST→GET→DELETE 라이프사이클.
  - E2E: ✅ 댓글 작성·삭제 골든패스.
  - Happy(정상): 정상 body → 200.
  - Failure(에러): 빈 body → 422. 타인 댓글 삭제 → 403. 무인증 → 401. 미존재 slug → 404.

### F-10: 태그 카탈로그

- MVP Cut: ✅ 포함
- 우선순위: P1
- 사용자 스토리: As a 사용자, I want 인기 태그를 보고 클릭 한 번으로 해당 태그 글만 모아보기, so that 관심 주제를 빠르게 탐색한다.
- Acceptance: Given Home 진입 When 사이드바 Popular Tags 클릭 Then `#<tag>` 탭 활성 + 글 카드 필터.
- R-ID 매핑: R-F-16, R-F-06
- 테스트 시나리오:
  - 단위: ✅ DISTINCT 태그 집계.
  - 통합: ✅ `GET /api/tags` + 글 0건/N건.
  - E2E: ✅ 태그 클릭 → 필터 적용 → 다시 Global Feed 탭 클릭 시 필터 해제.
  - Happy(정상): 태그 N건 반환.
  - Failure(에러): API 오류 시 사이드바 영역 “태그를 불러올 수 없습니다” + 본문은 정상 동작 유지.

### F-11: FE 라우팅·보호 라우트

- MVP Cut: ✅ 포함
- 우선순위: P0
- 사용자 스토리: As a 익명 사용자, I want 보호 페이지(Settings/Editor)에 잘못 접근하면 로그인 후 원래 경로로 돌아오기, so that 의도가 끊기지 않는다.
- Acceptance: Given 익명 사용자 When `/settings` 또는 `/editor[/:slug]` 진입 Then `/login?returnUrl=/<원래 경로>` 리다이렉트 + 로그인 성공 시 원래 경로로 복귀.
- R-ID 매핑: R-F-17
- 테스트 시나리오:
  - 단위: ✅ 라우트 가드 함수.
  - 통합: N/A (FE 단독).
  - E2E: ✅ 익명 `/settings` → `/login?returnUrl=/settings` → 로그인 → `/settings` 복귀.
  - Happy(성공): 회원 사용자 모든 라우트 직접 접근 OK.
  - Failure(거부): 익명 사용자 보호 라우트 → 리다이렉트. 만료 JWT → 토큰 비우고 `/login`으로.

## 4. MVP Cut 요약

| F-ID | MVP | 비고 |
| --- | --- | --- |
| F-01 인증 | ✅ 포함 | P0. R-F-01·02·03·R-N-02 |
| F-02 사용자 프로필 | ✅ 포함 | P0. R-F-03·04 |
| F-03 글 발견 (Home Global Feed + 태그 + 페이지네이션) | ✅ 포함 | P0. R-F-06·16·19 |
| F-04 Your Feed | ✅ 포함 | P0. R-F-07 |
| F-05 글 작성·수정·삭제 | ✅ 포함 | P0. R-F-09·10·11 |
| F-06 글 상세 + 마크다운 | ✅ 포함 | P0. R-F-08·13·18·R-N-03 |
| F-07 즐겨찾기 | ✅ 포함 | P0. R-F-12 |
| F-08 팔로우 | ✅ 포함 | P0. R-F-05·07 |
| F-09 댓글 | ✅ 포함 | P0. R-F-13·14·15 |
| F-10 태그 카탈로그 | ✅ 포함 | P1. R-F-16 |
| F-11 FE 라우팅·보호 라우트 | ✅ 포함 | P0. R-F-17 |
| (참고) 외부 RealWorld FE 상호운용 KPI | ❌ 제외 | 브리프 §4 마지막 KPI는 운영 단계 deferral 가능 (O-04) |
| (참고) 5분 부하 SLO (R-N-05) | ❌ 제외(연성) | P1. dev 환경 측정만 + 운영 단계 본격화 |

## 5. UX 원칙 / 화면 구성 큰 그림

- **레퍼런스 UI**: RealWorld 공식 Bootstrap 4 템플릿(고정). 자체 디자인 시스템 도입 비범위.
- **라우트 7종(R-F-17)**:
  1. `/` Home(Global Feed / Your Feed / Tag 탭)
  2. `/login` 로그인
  3. `/register` 회원가입
  4. `/settings` 프로필 설정(보호)
  5. `/editor[/:slug]` 글 작성·수정(보호)
  6. `/article/:slug` 글 상세
  7. `/profile/:username[/favorites]` 프로필·작성글/즐겨찾기 탭
- **공통 UI 요소**:
  - 헤더: 로고 / Home / 익명: Sign in·Sign up / 회원: New Article·Settings·@username.
  - 익명에서 “Follow / Favorite / Comment / Publish” 액션 시 `/login?returnUrl=...`로.
- **에러 표시**: 422 → 폼 상단 빨간 박스(`errors`의 모든 메시지 펼침). 5xx → 토스트 1개. 401 → 토큰 비우고 `/login` 이동.
- **빈 상태 카피**: Your Feed 빈 상태 = “팔로우하는 사용자가 없습니다. Global Feed에서 작가를 찾아보세요.” (OQ-S4 결정).

## 6. 의존성 / 외부 시스템

- **외부 사양 정본**: `realworld-docs.netlify.app` (변경 빈도 낮음). 변경 시 14 리스크에 R-DEPS-01로 추적.
- **공식 Postman Collection** (RealWorld 저장소). Newman으로 CI 회귀(R-N-01).
- **인프라**: 단일 인스턴스 + RDB(PostgreSQL/MySQL/SQLite 후보, 06 Architecture에서 확정).
- **외부 SaaS**: 0건.
- **빌드/배포**: `./devkit` 통일 진입점(`devtoolkit.config.yaml`). 스택 확정 후 commands 블록 작성.

## 7. Open Questions

- **OQ-P1** — 외부 RealWorld FE 상호운용성 KPI(브리프 §4 마지막 행)를 MVP 안에 둘지 운영 단계로 미룰지. (제안: 운영 단계.) → ADR-NN 또는 14 WBS에서 확정.
- **OQ-P2** — 빈 상태 카피 영문 vs 한글: 본 PRD는 한글 카피로 두지만, 사양은 영문. (제안: 영문 1차 + 한글 toggle 옵션은 비범위.)
- **OQ-P3** — 본인 자신 팔로우 거절 status(SRS OQ-02): 422 채택. PRD 행에서 동일 기조 유지.
- **OQ-P4** — `/profile/:username/favorites` 라우트 노출 위치(탭 UI). Bootstrap 4 템플릿에 두 탭 존재 — 그대로 채택.
