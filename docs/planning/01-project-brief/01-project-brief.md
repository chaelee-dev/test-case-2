---
doc_type: brief
version: v0.1 (Draft)
status: Draft
author: yongtae.cho@bespinglobal.com
date: 2026-05-15
gate: A
related:
  R-ID: []
  F-ID: []
  supersedes: null
---

# Conduit (RealWorld Medium 클론) — Project Brief

<!-- 출처: RFP = https://realworld-docs.netlify.app/introduction/ (RealWorld 공식 사양)
     본 brief는 Gate A(팀장 컨펌)용 의도 응축. 다음 산출: 02 Feasibility → 03~05 요구. -->

## 변경 이력

| Version | Date | Author | Change |
|---|---|---|---|
| v0.1 | 2026-05-15 | yongtae.cho@bespinglobal.com | 초안 — RealWorld Conduit 사양 기반 의도 응축 |

## 1. 한 줄 정의

RealWorld 공식 사양에 따른 **Medium.com 스타일 블로깅 SPA + REST API(이하 “Conduit”)** 의 자체 구현. 단일 사양(API + UI 템플릿)을 만족하는 풀스택 1세트를 제공한다.

## 2. 배경 / 문제 정의

- “Todo 앱” 수준 데모는 인증/관계/페이지네이션/마크다운/팔로우-피드 같은 **실서비스 구조**를 못 다룬다. 신규 기술스택 검증 시 비교 축이 부족하다.
- RealWorld 프로젝트는 동일 사양(`/api/articles`, `/api/profiles/:username/follow`, 7개 화면, JWT)을 다중 스택이 재구현하게 해 **스택 간 비교**를 가능하게 한 표준 벤치마크다(150+ 구현체 존재).
- 본 프로젝트는 (a) 우리 팀이 채택한 FE/BE 스택의 **end-to-end 실증**, (b) DevToolKit v6 자율개발 하네스의 **신규 프로젝트 1회 완주 검증**, 두 목적을 동시에 충족하는 reference 산출이다.

## 3. 핵심 사용자 / 이해관계자

- **익명 독자(Reader)** — 회원가입 없이 글 목록·태그·프로필을 탐색.
- **회원 작가(Author)** — 가입·로그인 후 글 작성/수정/삭제, 즐겨찾기, 팔로우, 댓글 작성/삭제.
- **회원 큐레이터(Follower)** — 팔로우한 작가의 글로 구성된 개인 피드(Your Feed)를 소비.
- **사내 이해관계자** — (1) FE/BE 팀장(스택 검증), (2) DevToolKit 메인테이너(하네스 1회 완주 dogfood), (3) QA(휴먼 게이트 검수).
- **외부 호환 클라이언트** — 동일 RealWorld API 규격을 따르는 타 RealWorld FE/BE와 상호운용 가능해야 한다.

## 4. 목표 (성공 정의)

| KPI | 측정 방법 | 목표값 | 달성 시점 |
| --- | --- | --- | --- |
| RealWorld API 사양 적합도 | RealWorld 공식 Postman collection (Newman) 통과율 | 100% (필수 엔드포인트 23개) | MVP 종료 시 |
| FE 화면 라우트 커버리지 | 7개 라우트(`/`, `/login`, `/register`, `/settings`, `/editor[/slug]`, `/article/:slug`, `/profile/:username[/favorites]`) 도달·렌더 E2E | 100% 라우트 PASS | MVP 종료 시 |
| 인증 골든패스 성공률 | 가입→로그인→글작성→즐겨찾기→로그아웃 E2E (gstack `/qa`) | ≥ 99% 성공 (3회 반복) | MVP 종료 시 |
| 회귀 단위·통합 테스트 통과율 | CI 단위+통합 스위트 | ≥ 95% line coverage on services, 100% pass | 머지 직전 매회 |
| 첫 글 작성 TTI (Anonymous→Published) | 가입부터 글 게시 완료까지 클릭 + 입력 수 | ≤ 9 클릭, ≤ 60초 (로컬 환경) | UX QA 시 |
| 외부 RealWorld FE와의 상호운용성 | 표준 RealWorld FE(예: ng-conduit) 가 본 BE로 동작 (로그인+글목록+팔로우) | 3개 시나리오 PASS | 운영 단계 |

## 5. 비목표 (Out of Scope)

- **마크다운 WYSIWYG 에디터**: 사양은 textarea + 마크다운 렌더 전제(Editor 화면). 리치 텍스트 에디터·이미지 업로드는 비범위.
- **소셜 로그인/OAuth**: RealWorld 사양은 username/email/password + JWT만 요구. OAuth, SSO, MFA, 비밀번호 재설정은 비범위.
- **알림(이메일/푸시)**: 댓글·팔로우 알림 없음. 본 사양에 없음.
- **모바일 네이티브 앱**: 반응형 Bootstrap 4 웹만. iOS/Android 네이티브 비범위.
- **국제화(i18n)**: 영어 단일 로케일(공식 템플릿).
- **결제·구독·관리자 백오피스**: 비범위.
- **검색**: 자유 텍스트 검색 비제공. 태그/저자/즐겨찾기 필터만 사양(쿼리 파라미터 `tag`, `author`, `favorited`).
- **CMS 워크플로우(드래프트·검토·예약 발행)**: 글은 작성 즉시 공개. 비공개 글 비범위.

## 6. 일정 (대략)

- **Phase 1 (본 메타, /flow-init)** — 2026-05-15: 01~05 산출.
- **Phase 2 (/flow-design)** — 06~13 (Architecture·HLD·LLD·API·DB·Conventions·Scaffolding·Test Design).
- **Phase 3 (/flow-wbs)** — 14·15 (리스크·WBS). Sprint 단위(1~3일/이슈) 분할.
- **Phase 4 (/flow-bootstrap)** — GitHub Issue·Milestone 등록 + mode=sprint 전환.
- **Implementation** — `/flow-feature` 반복. MVP 종료 목표: **약 3 sprint** (BE 인증·글·댓글 / FE 골든패스 / 통합·QA). 정확한 일정은 14 WBS에서 확정.

## 7. 리스크 (초기 식별)

- **R-INIT-01 (조기)** — RealWorld 사양 모호 영역(에러 메시지 i18n, 페이지네이션 정렬 순서, 슬러그 생성 규칙) 존재. **완화**: 04 SRS에서 보수적 결정(타임스탬프 DESC, kebab-case+중복 시 suffix) 명시 + Postman collection 우선.
- **R-INIT-02 (조기)** — 표준 FE 구현체(150+)와의 상호운용성: CORS, JWT 헤더 형식(`Authorization: Token <jwt>` vs `Bearer`)이 구현체마다 다름. **완화**: 공식 사양(`Token <jwt>`) 고정 + Newman 통과를 진실의 원천으로.
- **R-INIT-03 (조기)** — FE/BE 분리 SPA + JWT localStorage 저장 — XSS 시 토큰 탈취 가능. **완화**: HttpOnly cookie 대체 옵션은 사양상 “switchable”이라 명시되어 있으나, 본 MVP는 사양 충실(JWT in localStorage)로 가되 14 리스크에서 보완책 식별.
- **R-INIT-04 (조기)** — 단일 정본 RFP가 외부 문서(netlify)다. 사이트 다운/스펙 변경 시 학습 손실. **완화**: 본 brief + 04 SRS에 RealWorld 엔드포인트·페이로드 사본을 인용한다.
- **R-INIT-05 (조기)** — DevToolKit v6 strict harness mode + 본 RFP의 25+ R-ID 예상 규모로 schema validate BLOCK 발생 가능성 높음. **완화**: 04/05 작성 시 3축(단위·통합·E2E)·Happy/Failure 시나리오 누락 0 목표.

## 8. Open Questions

- **O-01** — JWT 만료(exp) 정책: 사양 미지정. 기본값은? (제안: 24h, /flow-design HLD에서 확정)
- **O-02** — Article 슬러그 생성 규칙: 사양 미지정. (제안: kebab-case(title) + 중복 시 `-<6자 해시>` suffix)
- **O-03** — 페이지네이션 기본/최대 limit: 사양 default 20. max는? (제안: 100)
- **O-04** — 외부 RealWorld FE 상호운용성 KPI(§4)는 MVP 안에 둘지 운영 단계로 미룰지 — 일정 빠듯 시 보류.
- **O-05** — 이미지 URL: 사양은 텍스트 URL 입력만(업로드 없음). 본 사양 고수 OK?
