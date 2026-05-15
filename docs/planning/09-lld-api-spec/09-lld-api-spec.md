---
doc_type: api-spec
version: v0.1 (Draft)
status: Draft
author: yongtae.cho@bespinglobal.com
date: 2026-05-15
gate: C
related:
  R-ID: [R-F-01, R-F-02, R-F-03, R-F-04, R-F-05, R-F-06, R-F-07, R-F-08, R-F-09, R-F-10, R-F-11, R-F-12, R-F-13, R-F-14, R-F-15, R-F-16, R-N-01, R-N-02, R-N-03]
  F-ID: [F-01, F-02, F-03, F-04, F-05, F-06, F-07, F-08, F-09, F-10]
  supersedes: null
---

# Conduit (RealWorld) — API Spec (LLD — 외부 인터페이스)

<!-- RealWorld 공식 사양 1:1. R-N-01 (Postman/Newman PASS) 정본. -->

## 변경 이력

| Version | Date | Author | Change |
|---|---|---|---|
| v0.1 | 2026-05-15 | yongtae.cho@bespinglobal.com | 초안 — 19 엔드포인트 본 명세 |

## 1. 개요

- **Base URL**: `${BACKEND_BASE}/api` (dev `http://localhost:3000/api`).
- **인증 헤더**: `Authorization: Token <jwt>` (사양 충실 — Bearer 미허용).
- **Content-Type**: `application/json; charset=utf-8` (요청·응답).
- **공통 래퍼**: `user / profile / article / articles / comment / comments / tags`.
- **공통 오류**: `{ "errors": { "<field|body>": ["<msg>", ...] } }` + HTTP `401|403|404|422`.
- **시간 표기**: ISO 8601 UTC (`createdAt`·`updatedAt`).
- **페이지네이션**: `limit` (기본 20, 최대 100) · `offset` (기본 0). 정렬: `createdAt DESC`.
- **slug 규칙**: `slugify(title)`; 충돌 시 `-<base36 6자 해시>` suffix.

## 2. 엔드포인트 목록

| 메서드 | 경로 | 목적 | F-ID | R-ID |
|---|---|---|---|---|
| POST | /api/users | 회원가입 | F-01 | R-F-01 |
| POST | /api/users/login | 로그인 | F-01 | R-F-02 |
| GET | /api/user | 현재 사용자 조회 | F-01, F-02 | R-F-03 |
| PUT | /api/user | 현재 사용자 갱신 | F-02 | R-F-03 |
| GET | /api/profiles/:username | 프로필 조회 | F-02 | R-F-04 |
| POST | /api/profiles/:username/follow | 팔로우 | F-08 | R-F-05 |
| DELETE | /api/profiles/:username/follow | 언팔로우 | F-08 | R-F-05 |
| GET | /api/articles | 글 목록 (tag/author/favorited 필터) | F-03 | R-F-06 |
| GET | /api/articles/feed | Your Feed | F-04 | R-F-07 |
| GET | /api/articles/:slug | 글 상세 | F-06 | R-F-08 |
| POST | /api/articles | 글 작성 | F-05 | R-F-09 |
| PUT | /api/articles/:slug | 글 수정 | F-05 | R-F-10 |
| DELETE | /api/articles/:slug | 글 삭제 | F-05 | R-F-11 |
| POST | /api/articles/:slug/favorite | 즐겨찾기 | F-07 | R-F-12 |
| DELETE | /api/articles/:slug/favorite | 즐겨찾기 해제 | F-07 | R-F-12 |
| GET | /api/articles/:slug/comments | 댓글 목록 | F-09 | R-F-13 |
| POST | /api/articles/:slug/comments | 댓글 작성 | F-09 | R-F-14 |
| DELETE | /api/articles/:slug/comments/:id | 댓글 삭제 | F-09 | R-F-15 |
| GET | /api/tags | 태그 목록 | F-10 | R-F-16 |

## 3. 엔드포인트 상세

### POST /api/users

- **인증**: 불필요.
- **Request**
  ```json
  { "user": { "username": "jacob", "email": "jacob@jacob.com", "password": "jakejake" } }
  ```
- **Response 200**
  ```json
  { "user": { "email": "jacob@jacob.com", "token": "<jwt>", "username": "jacob", "bio": "", "image": null } }
  ```
- **Response 4xx/5xx**

  | Status | 조건 | 본문 |
  |---|---|---|
  | 422 | 필드 누락·이메일 형식 위반·중복 username/email | `{"errors":{"email":["is invalid"], "username":["has already been taken"]}}` |
  | 500 | 미예상 | `{"errors":{"body":["internal server error"]}}` |
- **테스트 시나리오**: 04#R-F-01 Happy(정상 가입), Failure-A(이메일 형식 오류), Failure-B(중복).

### POST /api/users/login

- **인증**: 불필요.
- **Request** `{ "user": { "email": "jacob@jacob.com", "password": "jakejake" } }`
- **Response 200** `{ "user": { "email", "token", "username", "bio", "image" } }`
- **Response 4xx/5xx**

  | Status | 조건 | 본문 |
  |---|---|---|
  | 422 | 자격증명 불일치(미가입 email도 동일 메시지) | `{"errors":{"email or password":["is invalid"]}}` |
- **테스트 시나리오**: 04#R-F-02 Happy / Failure(잘못된 password).

### GET /api/user

- **인증**: 필수.
- **Request**: 본문 없음. 헤더 `Authorization: Token <jwt>`.
- **Response 200** `{ "user": { "email", "token", "username", "bio", "image" } }` (token 동일 또는 새로)
- **Response 4xx/5xx**

  | Status | 조건 | 본문 |
  |---|---|---|
  | 401 | JWT 누락/만료/위조/Bearer prefix | `{"errors":{"body":["unauthorized"]}}` |
- **테스트 시나리오**: 04#R-F-03 Happy(인증) / Failure(만료 JWT).

### PUT /api/user

- **인증**: 필수.
- **Request** `{ "user": { "email"?, "username"?, "password"?, "image"?, "bio"? } }` (부분 갱신, 화이트리스트).
- **Response 200**: 위 GET과 동일.
- **Response 4xx/5xx**

  | Status | 조건 | 본문 |
  |---|---|---|
  | 401 | 무인증 | `{"errors":{"body":["unauthorized"]}}` |
  | 422 | email 중복·이메일 형식·username 중복 | `{"errors":{"email":["has already been taken"]}}` |
- **테스트 시나리오**: 04#R-F-03 Happy(bio 갱신) / Failure(타인 email로 변경).

### GET /api/profiles/:username

- **인증**: 선택(있으면 following 계산).
- **Request**: 본문 없음.
- **Response 200** `{ "profile": { "username", "bio", "image", "following": boolean } }`
- **Response 4xx/5xx**

  | Status | 조건 | 본문 |
  |---|---|---|
  | 404 | 미존재 username | `{"errors":{"body":["profile not found"]}}` |
- **테스트 시나리오**: 04#R-F-04 Happy / Failure(미존재).

### POST /api/profiles/:username/follow

- **인증**: 필수.
- **Request**: 본문 없음.
- **Response 200**: 위 profile (following=true).
- **Response 4xx/5xx**

  | Status | 조건 | 본문 |
  |---|---|---|
  | 401 | 무인증 | `{"errors":{"body":["unauthorized"]}}` |
  | 404 | 미존재 username | `{"errors":{"body":["profile not found"]}}` |
  | 422 | 본인 자신 팔로우 시도 | `{"errors":{"body":["cannot follow yourself"]}}` |
- **테스트 시나리오**: 04#R-F-05 Happy / Failure(self-follow, 미존재).

### DELETE /api/profiles/:username/follow

- **인증**: 필수.
- **Request**: 본문 없음.
- **Response 200**: 위 profile (following=false).
- **Response 4xx/5xx**

  | Status | 조건 | 본문 |
  |---|---|---|
  | 401 | 무인증 | `{"errors":{"body":["unauthorized"]}}` |
  | 404 | 미존재 username | `{"errors":{"body":["profile not found"]}}` |
- **테스트 시나리오**: 04#R-F-05 Happy(언팔로우 후 following=false).

### GET /api/articles

- **인증**: 선택.
- **Request 쿼리**: `tag?`, `author?`, `favorited?`, `limit=20`, `offset=0`.
- **Response 200** `{ "articles": [{"slug","title","description","tagList","createdAt","updatedAt","favorited","favoritesCount","author":{"username","bio","image","following"}}, ...], "articlesCount": N }` (개별 article에 body 없음, 2024/08 사양).
- **Response 4xx/5xx**

  | Status | 조건 | 본문 |
  |---|---|---|
  | 422 | limit>100 / 음수 / offset 음수 | `{"errors":{"limit":["must be <=100"]}}` |
- **테스트 시나리오**: 04#R-F-06 Happy(tag 필터) / Failure(limit=999).

### GET /api/articles/feed

- **인증**: 필수.
- **Request 쿼리**: `limit=20`, `offset=0`.
- **Response 200**: 위 articles 목록 형식. 팔로우 0건 시 `{articles:[], articlesCount:0}`.
- **Response 4xx/5xx**

  | Status | 조건 | 본문 |
  |---|---|---|
  | 401 | 무인증 | `{"errors":{"body":["unauthorized"]}}` |
- **테스트 시나리오**: 04#R-F-07 Happy(팔로우한 작가 글) / Failure(무인증).

### GET /api/articles/:slug

- **인증**: 선택.
- **Request**: 본문 없음.
- **Response 200** `{ "article": { "slug","title","description","body","tagList","createdAt","updatedAt","favorited","favoritesCount","author":{...} } }`
- **Response 4xx/5xx**

  | Status | 조건 | 본문 |
  |---|---|---|
  | 404 | 미존재/삭제 slug | `{"errors":{"body":["article not found"]}}` |
- **테스트 시나리오**: 04#R-F-08 Happy / Failure(미존재).

### POST /api/articles

- **인증**: 필수.
- **Request** `{ "article": { "title", "description", "body", "tagList"?: [string,...] } }`
- **Response 200**: 단일 article(위와 동일).
- **Response 4xx/5xx**

  | Status | 조건 | 본문 |
  |---|---|---|
  | 401 | 무인증 | `{"errors":{"body":["unauthorized"]}}` |
  | 422 | title/description/body 빈 값 | `{"errors":{"title":["can't be empty"]}}` |
- **테스트 시나리오**: 04#R-F-09 Happy / Failure(빈 title).

### PUT /api/articles/:slug

- **인증**: 필수.
- **Request** `{ "article": { "title"?, "description"?, "body"? } }`. title 변경 시 slug 재생성.
- **Response 200**: 단일 article(갱신).
- **Response 4xx/5xx**

  | Status | 조건 | 본문 |
  |---|---|---|
  | 401 | 무인증 | `{"errors":{"body":["unauthorized"]}}` |
  | 403 | 타인 글 수정 | `{"errors":{"body":["forbidden"]}}` |
  | 404 | 미존재 slug | `{"errors":{"body":["article not found"]}}` |
  | 422 | 모든 필드가 부재(빈 patch) | `{"errors":{"body":["empty patch"]}}` |
- **테스트 시나리오**: 04#R-F-10 Happy(description 변경) / Failure(타인 글).

### DELETE /api/articles/:slug

- **인증**: 필수.
- **Request**: 본문 없음.
- **Response 200** `{}` 또는 204 No Content (사양은 모호 — 본 SRS는 200 `{}` 채택).
- **Response 4xx/5xx**

  | Status | 조건 | 본문 |
  |---|---|---|
  | 401 | 무인증 | `{"errors":{"body":["unauthorized"]}}` |
  | 403 | 타인 글 삭제 | `{"errors":{"body":["forbidden"]}}` |
  | 404 | 미존재 slug | `{"errors":{"body":["article not found"]}}` |
- **테스트 시나리오**: 04#R-F-11 Happy / Failure(타인 글).

### POST /api/articles/:slug/favorite

- **인증**: 필수.
- **Request**: 본문 없음.
- **Response 200**: 단일 article (favorited=true, favoritesCount +1).
- **Response 4xx/5xx**

  | Status | 조건 | 본문 |
  |---|---|---|
  | 401 | 무인증 | `{"errors":{"body":["unauthorized"]}}` |
  | 404 | 미존재 slug | `{"errors":{"body":["article not found"]}}` |
- **테스트 시나리오**: 04#R-F-12 Happy(첫 즐겨찾기) / Failure(무인증).

### DELETE /api/articles/:slug/favorite

- **인증**: 필수.
- **Request**: 본문 없음.
- **Response 200**: 단일 article (favorited=false, count -1; 이미 0이면 그대로).
- **Response 4xx/5xx**

  | Status | 조건 | 본문 |
  |---|---|---|
  | 401 | 무인증 | `{"errors":{"body":["unauthorized"]}}` |
  | 404 | 미존재 slug | `{"errors":{"body":["article not found"]}}` |
- **테스트 시나리오**: 04#R-F-12 Happy(해제).

### GET /api/articles/:slug/comments

- **인증**: 선택.
- **Request**: 본문 없음.
- **Response 200** `{ "comments": [{"id","createdAt","updatedAt","body","author":{"username","bio","image","following"}}, ...] }`
- **Response 4xx/5xx**

  | Status | 조건 | 본문 |
  |---|---|---|
  | 404 | 미존재 slug | `{"errors":{"body":["article not found"]}}` |
- **테스트 시나리오**: 04#R-F-13 Happy / Failure(미존재).

### POST /api/articles/:slug/comments

- **인증**: 필수.
- **Request** `{ "comment": { "body": "Thank you for your post!" } }`
- **Response 200** `{ "comment": {...} }`
- **Response 4xx/5xx**

  | Status | 조건 | 본문 |
  |---|---|---|
  | 401 | 무인증 | `{"errors":{"body":["unauthorized"]}}` |
  | 404 | 미존재 slug | `{"errors":{"body":["article not found"]}}` |
  | 422 | 빈 body | `{"errors":{"body":["can't be empty"]}}` |
- **테스트 시나리오**: 04#R-F-14 Happy / Failure(빈 body).

### DELETE /api/articles/:slug/comments/:id

- **인증**: 필수.
- **Request**: 본문 없음.
- **Response 200** `{}`
- **Response 4xx/5xx**

  | Status | 조건 | 본문 |
  |---|---|---|
  | 401 | 무인증 | `{"errors":{"body":["unauthorized"]}}` |
  | 403 | 타인 댓글 삭제 | `{"errors":{"body":["forbidden"]}}` |
  | 404 | 미존재 slug 또는 id | `{"errors":{"body":["comment not found"]}}` |
- **테스트 시나리오**: 04#R-F-15 Happy / Failure(타인 댓글).

### GET /api/tags

- **인증**: 불필요.
- **Request**: 본문 없음.
- **Response 200** `{ "tags": ["realworld","react","node",...] }`
- **Response 4xx/5xx**

  | Status | 조건 | 본문 |
  |---|---|---|
  | 500 | DB 오류 | `{"errors":{"body":["internal server error"]}}` |
- **테스트 시나리오**: 04#R-F-16 Happy / Failure(DB 오류 — 안전망).

## 4. Webhook / 콜백

- **없음** — 본 시스템은 외부 호출/콜백을 가지지 않는다 (06 §3, 07 §4 정합).

## 5. Rate Limit / Quota

- **MVP**: 적용 안 함(단일 인스턴스 + 내부 dogfood). 운영 단계 진입 시 IP 기준 60 req/min·user 기준 600 req/min 도입 검토(14 리스크 등록).
- **5xx 폭주 가드**: 동일 IP에서 5분 내 5xx 50건 초과 시 알람 로그(traceId 묶음). MVP는 로그만, 운영 차단은 deferral.
- **CORS 제한**: allow-list 화이트리스트만 응답 (R-N-02 보조).
