---
doc_type: user-scenarios
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

# Conduit (RealWorld) — 사용자 시나리오

<!-- Gate B 진입 산출. 03 user-scenarios → 04 SRS · 05 PRD 의 인풋이다.
     UC-NN ID 부여 필수(schema BLOCK). -->

## 변경 이력

| Version | Date | Author | Change |
|---|---|---|---|
| v0.1 | 2026-05-15 | yongtae.cho@bespinglobal.com | 초안 — 4 페르소나, 12 UC, 4 NFR 시나리오 |

## 1. 페르소나

| 페르소나 | 역할 | 환경 / 컨텍스트 | 주요 목표 |
| --- | --- | --- | --- |
| **P1. 익명 독자 (Reader)** | 비회원 방문자 | 데스크톱·태블릿 브라우저, 검색엔진/링크로 진입 | 회원가입 없이 글·태그·프로필을 훑어본다 |
| **P2. 신규 작가 (Newbie Author)** | 가입 직후 회원 | 데스크톱 브라우저, 본인 첫 글 작성 의지 | 가입→로그인→첫 글 게시까지 마찰 없이 완료 |
| **P3. 회원 작가 (Power Author)** | 글 N건 보유 회원 | 데스크톱 브라우저, 정기적으로 작성/수정 | 글 작성/수정/삭제, 댓글 응답, 즐겨찾기 관리 |
| **P4. 큐레이터 (Follower)** | 글은 거의 안 쓰고 읽기 위주 회원 | 데스크톱·태블릿 | 좋아하는 작가를 팔로우, Your Feed 로 큐레이션된 글만 본다 |

## 2. 사용자 여정 (큰 그림)

```
                 [익명 진입 /]
                       │
            ┌──────────┼───────────┐
            ▼          ▼           ▼
       Global Feed   Tag 필터   Profile/Article 열람
            │
            ▼  (관심 발생)
       [회원가입 /register] ─► [로그인 /login]
            │                           │
            └─────────► [Settings 프로필 보완] ◄┐
                                                │
       ┌───────────────────────────────┐        │
       │     로그인 상태 (JWT 보유)      │────────┘
       └───────────────────────────────┘
        │            │           │           │
        ▼            ▼           ▼           ▼
   [글 작성 /editor]  [팔로우]  [즐겨찾기]  [댓글]
        │
        ▼
   Article 페이지에서 본인 글 수정/삭제
        │
        ▼
   [Your Feed /] : 팔로우한 작가의 글만
```

핵심 분기:
- **Anonymous → Auth 전환점**: 좋아요/팔로우/댓글/작성 어떤 액션이든 시도 시 `/login`으로 리다이렉트.
- **Anonymous Home**: Global Feed만 표시. Your Feed 탭 미표시.
- **Authed Home**: Your Feed 탭 기본 활성 (팔로우 0건이면 빈 상태 안내).

## 3. Use Case

### UC-01: 익명 사용자 Global Feed 열람

- **Actor**: P1 익명 독자
- **Pre**: 로그인되지 않음
- **Flow (Happy)**: `/` 진입 → 배너 + Global Feed 탭 활성 → 최신 20건 미리보기 렌더(저자/날짜/즐겨찾기수/제목/요약/태그) → 사이드바 “Popular Tags” 표시 → 페이지네이션 클릭하면 offset 변경.
- **Failure**: 네트워크 실패 시 “글을 불러올 수 없습니다” + 재시도 버튼.
- **Post**: 어떤 상태도 변경 없음(GET only).

### UC-02: 회원가입

- **Actor**: P1 → P2 전환
- **Pre**: 미가입
- **Flow (Happy)**: `/register` → username/email/password 입력 → Submit → 가입 성공 → JWT 발급·localStorage 저장 → `/`로 이동, 본인 username 헤더 표시.
- **Failure-A (검증)**: 이메일 형식 오류·필수 누락 → 422 errors 메시지 폼 상단 표시.
- **Failure-B (중복)**: username/email 이미 사용 중 → 422 + 필드별 에러.
- **Post**: User 1건 생성, 로그인 상태.

### UC-03: 로그인

- **Actor**: P2/P3/P4
- **Pre**: 가입됨, 로그아웃 상태
- **Flow (Happy)**: `/login` → email/password → Submit → JWT 발급·저장 → 직전 페이지 또는 `/`로 이동.
- **Failure**: 자격 증명 불일치 → 422 "email or password is invalid" 표시.
- **Post**: 인증 토큰 보유.

### UC-04: 프로필 설정 변경

- **Actor**: P2/P3
- **Pre**: 로그인
- **Flow (Happy)**: `/settings` → image URL/이름/bio/email/password 일부 변경 → Update → 200 → 새 프로필 반영(Global Feed의 본인 글 저자 이름이 갱신됨).
- **Failure**: email 중복·이메일 형식 위반 → 422 표시.
- **Post**: User 갱신.

### UC-05: 글 작성 (Publish)

- **Actor**: P2/P3
- **Pre**: 로그인
- **Flow (Happy)**: `/editor` → title/description/body(마크다운)/tagList 입력 → Publish → 200 + slug 발급 → `/article/:slug`로 이동, 본인 글로 렌더(Edit/Delete 버튼 노출).
- **Failure-A (검증)**: title/description/body 빈 값 → 422 "can't be empty".
- **Failure-B (인증)**: JWT 만료/없음 → 401 → `/login` 리다이렉트.
- **Post**: Article 1건 + Tag N건(신규 시).

### UC-06: 글 수정

- **Actor**: P3 (작성자 본인)
- **Pre**: 본인 글 보유, 로그인
- **Flow (Happy)**: 본인 Article 페이지 → Edit Article → `/editor/:slug` (기존 내용 prefill) → 일부 필드 변경 → Update → 200 → Article 페이지로 복귀, 변경 반영.
- **Failure-A (권한)**: 타인 글에 PUT 시도 → 403.
- **Failure-B (미존재)**: 삭제된 slug 접근 → 404.
- **Post**: Article 갱신.

### UC-07: 글 삭제

- **Actor**: P3 (작성자 본인)
- **Pre**: 본인 글 + 로그인
- **Flow (Happy)**: 본인 Article 페이지 → Delete Article → 확인 → DELETE 성공 → `/`로 이동, 목록에서 사라짐.
- **Failure**: 타인 글 삭제 시도 → 403. 미존재 → 404.
- **Post**: Article 1건 제거(연관 댓글·즐겨찾기 cascade).

### UC-08: 즐겨찾기 / 해제

- **Actor**: P3/P4
- **Pre**: 로그인
- **Flow (Happy)**: 임의 Article에서 ❤ 클릭 → favoritesCount +1, favorited=true → 다시 클릭 → -1, favorited=false. 익명 시 클릭하면 `/login`으로.
- **Failure**: 미존재 slug → 404.
- **Post**: Favorite 1건 toggle.

### UC-09: 팔로우 / 언팔로우

- **Actor**: P3/P4
- **Pre**: 로그인, 본인 ≠ 대상 사용자
- **Flow (Happy)**: `/profile/:username` → Follow → following=true → Your Feed에 해당 작가의 글이 즉시 포함. 다시 클릭 → 언팔로우.
- **Failure-A**: 자기 자신 팔로우 시도 → 403 또는 422 (보수: 422 "cannot follow self"). 본인 프로필에서는 Follow 버튼 비노출이 기본.
- **Failure-B**: 미존재 username → 404.
- **Post**: Follow 관계 toggle.

### UC-10: Your Feed (팔로우 기반 피드) 열람

- **Actor**: P3/P4
- **Pre**: 로그인
- **Flow (Happy)**: `/` → 기본 “Your Feed” 탭 활성 → 팔로우한 작가들의 글 최신 20건. Global Feed 탭으로 토글 가능.
- **Empty**: 팔로우 0건 시 “팔로우하는 사용자가 없습니다” 빈 상태 + Global Feed로 안내.
- **Failure**: JWT 만료 → 401 → `/login`.

### UC-11: 댓글 쓰기·삭제

- **Actor**: P3/P4
- **Pre**: 로그인, Article 페이지 열림
- **Flow (Happy)**: Article 하단 폼에 본문 입력 → Post Comment → 200 → 목록에 즉시 추가(저자=본인). 본인 댓글 우측 휴지통 클릭 → DELETE → 목록에서 제거.
- **Failure-A**: 빈 본문 → 422.
- **Failure-B**: 타인 댓글 삭제 시도 → 403.
- **Post**: Comment 생성/제거.

### UC-12: 태그 필터링

- **Actor**: P1/P3/P4
- **Pre**: 무관
- **Flow (Happy)**: 사이드바 “Popular Tags” 또는 글 카드의 태그 클릭 → Home에 “# <tag>” 탭 추가·활성 → 해당 태그 글만 표시 → Global/Your Feed 탭 클릭 시 태그 탭 해제.
- **Failure**: 미존재 태그 클릭 시 빈 목록 + “결과 없음” 안내. 5xx 시 토스트.

## 4. 비기능 시나리오

- **NFR-S1 보안**: JWT는 `Authorization: Token <jwt>` 헤더로만 전송. 만료된 JWT로 보호 엔드포인트 호출 시 401 + FE는 자동으로 토큰 비우고 `/login`으로 리다이렉트.
- **NFR-S2 정합도**: 공식 RealWorld Postman Collection을 BE에 돌렸을 때 전 케이스 PASS. 어느 하나 실패 시 머지 차단.
- **NFR-S3 가용성**: 단일 인스턴스 dev 환경에서 5분 부하 테스트(20 RPS) 동안 5xx 0건. 단, 본 KPI는 운영 단계로 미룰 수 있음(브리프 §4 정합).
- **NFR-S4 접근성/UX**: Bootstrap 4 기본 컴포넌트를 따르므로 키보드 포커스·라벨이 기본 충족. 추가 a11y 작업은 비범위.

## 5. Open Questions

- **OQ-S1** — “자기 자신 팔로우” 거절은 403 vs 422 중 무엇이 사양에 더 가까운지. RealWorld 공식 사양은 모호 — Postman 케이스를 우선으로 결정(04 SRS에서 확정).
- **OQ-S2** — 익명에서 즐겨찾기/팔로우 클릭 시 “로그인 모달” vs “/login 라우트 이동” 중 어느 UX인지. (제안: 라우트 이동 + returnUrl 쿼리, 05 PRD에서 확정.)
- **OQ-S3** — Editor에서 ‘마크다운 미리보기 탭’ 제공 여부. 사양 외 요소이므로 기본 제외, 04 SRS Out of Scope.
- **OQ-S4** — Your Feed 빈 상태(팔로우 0건) 안내 카피 — 카피 raw는 05 PRD에서.
