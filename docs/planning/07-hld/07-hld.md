---
doc_type: hld
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

# Conduit (RealWorld) — High-Level Design (HLD)

<!-- ADR-0031: HLD §1 모듈 분해 BLOCK. 08~10 LLD가 본 §1 fan-out으로 연결. -->

## 변경 이력

| Version | Date | Author | Change |
|---|---|---|---|
| v0.1 | 2026-05-15 | yongtae.cho@bespinglobal.com | 초안 — FE 6 모듈 + BE 8 모듈 분해, 데이터 흐름, 비기능 6대 대응 |

## 1. 핵심 모듈 / 컴포넌트

| 모듈 | 책임 | 의존 | 08에서 상세 |
|---|---|---|---|
| **M-FE-RouterShell** (FE) | 7 라우트 정의·보호 라우트 가드·returnUrl 처리 | M-FE-AuthCtx | 08 §1.1 |
| **M-FE-AuthCtx** (FE) | JWT 보관(localStorage)·login/logout·헤더에 자동 부착 | (없음) | 08 §1.2 |
| **M-FE-ApiClient** (FE) | fetch 래퍼·`Authorization: Token <jwt>` 헤더·표준 오류 파서 | M-FE-AuthCtx | 08 §1.3 |
| **M-FE-Pages** (FE) | 7 라우트 페이지 컴포넌트(Home·Login·Register·Settings·Editor·Article·Profile) | M-FE-ApiClient, M-FE-Markdown | 08 §1.4 |
| **M-FE-Components** (FE) | 공용: ArticleCard·Pagination·TagList·CommentItem·ErrorList | M-FE-Markdown | 08 §1.5 |
| **M-FE-Markdown** (FE) | marked + DOMPurify 래퍼 (XSS 방어, R-F-18) | (없음) | 08 §1.6 |
| **M-BE-HttpServer** (BE) | Express 부트스트랩·미들웨어 체인(CORS·JSON·logger·errorHandler) | (없음) | 08 §2.1 |
| **M-BE-AuthMiddleware** (BE) | `Authorization: Token <jwt>` 파싱·검증·`req.user` 부착 (R-N-02) | M-BE-JwtService, M-BE-UserRepo | 08 §2.2 |
| **M-BE-Routers** (BE) | 19 엔드포인트 라우팅 정의 → Controller 위임 | M-BE-AuthMiddleware, Services | 08 §2.3 |
| **M-BE-UserService** (BE) | 가입·로그인·프로필·팔로우 (R-F-01·02·03·04·05) | M-BE-UserRepo, M-BE-FollowRepo, M-BE-JwtService | 08 §2.4 |
| **M-BE-ArticleService** (BE) | 글 CRUD·필터·피드·즐겨찾기 (R-F-06~12) | M-BE-ArticleRepo, M-BE-FavoriteRepo, M-BE-FollowRepo, M-BE-TagRepo | 08 §2.5 |
| **M-BE-CommentService** (BE) | 댓글 CRUD (R-F-13·14·15) | M-BE-CommentRepo, M-BE-ArticleRepo | 08 §2.6 |
| **M-BE-Repos** (BE) | Prisma 기반 데이터 접근: User/Article/Comment/Tag/Favorite/Follow | Prisma Client → DB | 08 §2.7 |
| **M-BE-ErrorMapper** (BE) | 도메인 에러 → `{errors:{...}}` + HTTP 401/403/404/422 (R-N-03) | (없음) | 08 §2.8 |
| **M-BE-JwtService** (BE) | 서명·검증·exp=24h (R-N-02) | env `JWT_SECRET` | 08 §2.9 |

> **Trace 규약**: 08 Module Spec의 각 “모듈 개요”는 본 표의 모듈 ID(`M-FE-*` / `M-BE-*`)를 “07 HLD §1 참조”로 인용한다 (ADR-0031 BLOCK).

## 2. 모듈 간 데이터 흐름

```
[로그인 흐름 — F-01 / R-F-02]
 Browser ─▶ M-FE-Pages(Login) ─submit▶ M-FE-ApiClient ─POST /api/users/login▶ M-BE-Routers
                                                                                    │
                                                                                    ▼
                                                                              M-BE-UserService
                                                                                    │
                                                                ┌──────────────────┴───────────────────┐
                                                                ▼                                       ▼
                                                          M-BE-UserRepo                          M-BE-JwtService
                                                          (verify bcrypt)                        (sign exp=24h)
                                                                ▲                                       │
                                                                └───────────── token ◀──────────────────┘
 Browser ◀── 200 {user:{token,…}} ◀── M-FE-ApiClient ◀── M-BE-ErrorMapper ◀── M-BE-Routers
        └─ M-FE-AuthCtx.setToken(localStorage)

[글 작성 — F-05 / R-F-09]
 Editor ─▶ M-FE-ApiClient ─POST /api/articles (Token jwt)▶ M-BE-AuthMiddleware ─req.user▶ M-BE-Routers
                                                                                              │
                                                                                              ▼
                                                                                       M-BE-ArticleService
                                                                                              │
                                                                ┌─────────────────────────────┴───────┐
                                                                ▼                                      ▼
                                                          M-BE-ArticleRepo                       M-BE-TagRepo
                                                          (slug 생성·insert)                    (upsert tags + M:N)
                                                                ▲                                      ▲
                                                                └───────── article + tags ◀────────────┘
 Browser ◀── 200 {article:{…}} ◀── M-FE-Pages(Article) ◀── M-FE-ApiClient

[글 목록 + Your Feed — F-03 / F-04 / R-F-06·07]
 Home ─▶ M-FE-ApiClient ─GET /api/articles?tag&author&favorited&limit&offset▶ M-BE-ArticleService
                                                                                       │
                                                                                       ▼
                                                                                  M-BE-ArticleRepo
                                                                                       │
                                                                                       ▼
                                                                                  M-BE-FavoriteRepo (count·flag)
                                                                                  M-BE-FollowRepo (Your Feed 시)

[즐겨찾기 토글 — F-07 / R-F-12]
 ArticleCard ─click ❤▶ M-FE-ApiClient ─POST/DELETE /api/articles/:slug/favorite▶ M-BE-ArticleService
                                                                                          │
                                                                                          ▼
                                                                                   M-BE-FavoriteRepo (upsert/delete)
                                                                                          ▼
                                                                                   M-BE-ArticleRepo (count 재계산)

[오류 흐름 — R-N-03]
 어디서든 도메인 에러 throw ─▶ M-BE-ErrorMapper ─JSON {errors:{key:[msg]}} + HTTP 401/403/404/422▶ M-FE-ApiClient
                                                                                                       │
                                                                                                       ▼
                                                                                                M-FE-Components.ErrorList
                                                                                                (폼 상단 빨간 박스)
```

- **트랜잭션 경계**: M-BE-Service 단위. M-BE-ArticleService.publish()는 article insert + tag upsert + M:N link 1 트랜잭션.
- **idempotency**: 즐겨찾기·팔로우는 unique (user_id, target_id) 제약 + onConflict(do nothing). 중복 POST에도 동일 상태.
- **에러 전파**: 도메인 레이어(Service)는 throw, Router의 try/catch가 ErrorMapper로 전달. 핸들러 안에서 status 직접 호출 금지(11 §2 규칙).

## 3. 비기능 대응

| 비기능 R-ID | 대응 전략 | 상세 |
|---|---|---|
| R-N-01 (표준 적합) | Newman CI 작업 + Postman 컬렉션 고정 | CI에서 SQLite seed 후 `newman run` → 실패 시 PR 머지 차단. 9-API-Spec 엔드포인트는 사양 1:1 |
| R-N-02 (인증 보안) | M-BE-AuthMiddleware + JwtService + bcrypt cost=12 | `Authorization: Token <jwt>` 만 허용(Bearer 거절). exp=24h. 위조/만료 → 401. FE는 401 응답 시 토큰 비우고 `/login` |
| R-N-03 (오류 표준) | M-BE-ErrorMapper 단일 책임 | 도메인 에러 → `{errors:{<key>:[<msg>]}}` + 401/403/404/422. 5xx는 traceId 로깅 + 일반 메시지 |
| R-N-04 (무결성) | Prisma unique·foreign·cascade + Service 트랜잭션 | username/email/slug unique, Article 삭제 시 Comment·Favorite·ArticleTag cascade |
| R-N-05 (성능 SLO) | 인덱스(`article.author_id`, `article.created_at DESC`, `favorite(user_id,article_id)`, `follow(follower_id,followee_id)`) | dev 환경 20 RPS × 5분에서 p95 < 300ms. 운영 단계로 deferral 가능 (05 OQ-P1) |
| R-N-06 (접근성·브라우저) | Bootstrap 4 기본 a11y + Playwright 키보드 시나리오 1건 | tabindex 누락 0, label↔input htmlFor 정합. 최신 Chrome/Firefox/Safari 1세대 |

## 4. 외부 인터페이스 윤곽

- **공개 API**: 19 엔드포인트(09 LLD API Spec 정본). 베이스 `/api`. 모두 JSON.
- **인증 헤더**: `Authorization: Token <jwt>` (사양 충실, Bearer 미허용).
- **응답 헤더**: `Content-Type: application/json; charset=utf-8`, `Access-Control-Allow-Origin`(allow-list).
- **외부 호출(아웃바운드)**: 0건.
- **CI 외부 도구 인터페이스**: Newman(Postman JSON), Playwright(브라우저 자동화). 둘 다 본 저장소 안.
