---
doc_type: coding-conventions
version: v0.1 (Draft)
status: Draft
author: yongtae.cho@bespinglobal.com
date: 2026-05-15
gate: C
related:
  R-ID: [R-N-02, R-N-03]
  F-ID: []
  supersedes: null
---

# Conduit (RealWorld) — Coding Conventions

<!-- TypeScript 5 단일 언어 컨벤션. ESLint·Prettier·tsc로 자동 강제. -->

## 변경 이력

| Version | Date | Author | Change |
|---|---|---|---|
| v0.1 | 2026-05-15 | yongtae.cho@bespinglobal.com | 초안 — TS 명명·에러·Lint·Import 정책 |

## 1. 명명 규칙

| 항목 | 규칙 | 예 |
|---|---|---|
| 파일명 (모듈) | kebab-case `.ts` | `article-service.ts`, `auth-middleware.ts` |
| 파일명 (React 컴포넌트) | PascalCase `.tsx` | `ArticleCard.tsx`, `LoginPage.tsx` |
| 파일명 (테스트) | `<unit>.spec.ts` 단위 / `<unit>.int.spec.ts` 통합 / `<flow>.e2e.ts` E2E | `articleService.spec.ts`, `articles.int.spec.ts`, `auth.e2e.ts` |
| 타입·인터페이스 | PascalCase, prefix 금지 (`I`·`T` 안 씀) | `Article`, `AuthContextValue` |
| 함수·메서드 | camelCase, 동사+명사 | `generateSlug`, `findBySlug` |
| 변수·파라미터 | camelCase | `viewerId`, `articlesCount` |
| 상수 (모듈 상수) | UPPER_SNAKE_CASE | `JWT_EXP_SECONDS = 86400`, `MAX_PAGE_LIMIT = 100` |
| Enum / Union 리터럴 | PascalCase 키, kebab/snake 값 | `type FeedTab = 'your' | 'global' | 'tag'` |
| Express 라우터 파일 | 도메인 단수 kebab + `.ts` | `users.ts`, `articles.ts`, `profiles.ts`, `comments.ts`, `tags.ts` |
| Prisma 모델 | PascalCase 단수 | `User`, `Article`, `Comment`, `Tag`, `Favorite`, `Follow` |
| DB 컬럼 | snake_case | `created_at`, `author_id`, `favorites_count` (Prisma `@map`로 매핑) |
| React Hook | `use` prefix + camelCase | `useAuth`, `useArticle(slug)`, `usePagination` |
| 환경변수 | UPPER_SNAKE_CASE | `JWT_SECRET`, `DATABASE_URL`, `CORS_ALLOW_ORIGINS` |
| Route slug 경로 | kebab-case, 매개변수는 `:colon` 단일어 | `/articles/:slug`, `/profiles/:username/follow` |

## 2. 에러 코드 PREFIX/SUFFIX

> RealWorld 사양은 에러 *문자열*만 정의(`"can't be empty"` 등) — 별도 코드 체계 없음. 본 프로젝트는 도메인별 에러 **클래스** prefix 규약을 둔다.

| 도메인 | PREFIX | 예 |
|---|---|---|
| 검증 실패 | `Validation*` (HTTP 422) | `ValidationError("email","is invalid")`, `ValidationError("title","can't be empty")` |
| 인증 실패 | `Unauthorized*` (HTTP 401) | `UnauthorizedError("unauthorized")` |
| 권한 부족 | `Forbidden*` (HTTP 403) | `ForbiddenError("forbidden")` |
| 미존재 | `NotFound*` (HTTP 404) | `NotFoundError("article not found")`, `NotFoundError("comment not found")` |
| 중복 (사양상 422) | `Conflict*` (HTTP 422, **409 사용 금지**) | `ConflictError("username","has already been taken")` |
| 미예상 | `Internal*` (HTTP 5xx) | `InternalError("...")` — 응답 body는 항상 `"internal server error"` 고정, 상세는 로그만 |
| FE API 응답 파서 | `Api*` (FE 내부) | `ApiNetworkError`, `ApiValidationError` |

- **메시지 문자열**: RealWorld 사양 메시지(`"can't be empty"`, `"has already been taken"`, `"is invalid"`, `"unauthorized"`, `"forbidden"`, `"<noun> not found"`, `"internal server error"`)를 정본으로 한다. 임의 신규 문자열 금지(Newman 회귀 깨질 수 있음, R-N-01).
- **에러 응답 JSON 키**: 필드 검증 = 필드명, 그 외 = `body` (사양 충실). 예: `{"errors":{"email":["..."]}}` / `{"errors":{"body":["unauthorized"]}}`.

## 3. 언어 관용구

- **TypeScript strict 모드 강제** — `tsconfig.json` `"strict": true` + `"noUncheckedIndexedAccess": true`. `any` 금지(except `unknown` 캐스팅 후 검증).
- **Null 처리**: nullable 컬럼은 `string | null` 명시. 옵셔널은 `?:`로 구분(없을 수도 있음 ≠ null).
- **에러 throw / return**: 도메인 에러는 throw, 예측 가능한 빈 결과는 `null` 반환 (예: `findBySlug` → `Article | null`).
- **async/await만 사용** — `.then()` 체이닝 금지(except 라이브러리 콜백 어댑팅).
- **불변성**: 함수형 스타일 우선. `Array.prototype.push` 등 변형은 로컬 변수에만. 컬렉션 변환은 `map`/`filter`/`reduce`.
- **불변 객체 spread vs Object.assign**: spread 사용 (`{ ...a, b: 1 }`).
- **fetch 응답 파싱**: M-FE-ApiClient 단일 경로로만. 페이지 컴포넌트가 직접 `fetch` 호출 금지.
- **React 함수형 컴포넌트만** — Class 컴포넌트 금지.
- **Hook 규칙**: ESLint `react-hooks/rules-of-hooks` 강제. 컴포넌트 최상위에서만 호출.
- **Express 핸들러**: 비동기 핸들러는 `asyncHandler(fn)` 래퍼로 wrap (자동 try/catch → next(err)).
- **DB 쿼리**: Prisma Client만. 원시 SQL은 `prisma.$queryRaw`로 한정하고 11 §6 import 정책으로 격리.
- **Date**: `Date.now()`·`new Date()`만. moment.js 등 금지.

## 4. 주석 정책

- **기본: 주석 작성 금지**. 코드와 잘 명명된 식별자로 의도를 표현.
- **예외 1 (WHY 주석)**: 비명확한 비즈니스 결정·외부 제약·우회 사유 — 1~3줄로 명시. 예: `// RealWorld 사양은 self-follow 거절을 422로 정의 (04 OQ-02)`.
- **예외 2 (TODO)**: `// TODO(<owner-id>): <action> by <YYYY-MM-DD>`. owner·기한 없는 TODO는 ESLint로 금지.
- **금지**: WHAT 설명 주석(`// 사용자 가져오기` 등 코드 그대로 옮긴 것), 작성자/날짜 헤더(git blame이 정본), 큰 ASCII 박스 헤더.
- **JSDoc**: 공개 라이브러리가 아니므로 강제 X. 다만 외부에서 호출되는 함수 시그니처에서 매개변수 의미가 비명확하면 JSDoc 1~2줄 권고.
- **마크다운 문서 안의 코드 블록**: 가능하면 실제 파일을 인용(상대 경로 + 라인 번호) — 복붙 사본은 drift 원인.

## 5. Lint·포맷

| 도구 | 룰셋 | 자동 강제 |
|---|---|---|
| ESLint 9 | `@typescript-eslint/recommended-type-checked` + `react`·`react-hooks`·`import` + 본 §3 보강(no-any, no-floating-promises, no-misused-promises) | pre-commit (lint-staged) + CI `eslint --max-warnings 0` |
| Prettier 3 | `"singleQuote": true, "semi": true, "trailingComma": "all", "printWidth": 100, "arrowParens": "always"` | pre-commit (Prettier --write) + CI `prettier --check` |
| TypeScript | `tsc --noEmit` strict | CI build job, pre-commit (옵션) |
| Stylelint | (CSS 거의 미사용) — Bootstrap 4 그대로. 자체 CSS 도입 시 도입 | (현재 없음) |
| Markdownlint | `MD013` line-length 비활성, `MD041` 첫 H1 강제 | pre-commit (옵션) |
| pre-commit | husky + lint-staged | `.husky/pre-commit` + `package.json` `lint-staged` |

- **CI 게이트**: `pnpm -w lint && pnpm -w typecheck && pnpm -w test` 통과 없으면 PR 머지 차단.
- **포맷 충돌**: ESLint 룰과 Prettier 룰이 충돌하면 Prettier 우선 (`eslint-config-prettier` 적용).
- **자동 수정 한계**: `eslint --fix`로 자동 수정 안 되는 룰(예: `no-floating-promises`)은 사람이 수정.

## 6. Import 정책

- **import 순서** (ESLint `import/order` 자동 정렬, 그룹 사이 빈 줄 1):
  1. Node builtin (`node:fs`)
  2. 외부 패키지 (`react`, `express`, `prisma`)
  3. 본 저장소 절대 경로 alias (`@/services/...`, `@/types/...`)
  4. 상대 경로 (`./utils`, `../repos/...`)
  5. CSS·assets (`./styles.css`, `../assets/logo.svg`)
- **alias**: FE = `@/` → `frontend/src/`. BE = `@/` → `backend/src/`. tsconfig `paths`로 정의.
- **circular import 금지** — ESLint `import/no-cycle` BLOCK.
- **Side-effect import 금지** — `import './polyfill'` 형태는 `main.ts` 진입 한 곳에서만.
- **Re-export**: barrel(`index.ts`)은 모듈 디렉토리 루트에 1개까지. 무분별한 re-export는 import 비용 + 순환 위험.
- **prisma`$queryRaw`**: `backend/src/repos/raw/` 격리 디렉토리에만. 도메인 서비스에서 직접 import 금지.
