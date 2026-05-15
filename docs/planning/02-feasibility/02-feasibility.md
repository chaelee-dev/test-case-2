---
doc_type: feasibility
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

# Conduit (RealWorld) — Feasibility

<!-- 1장 이내 권고(ADR-0013). Gate A 보조 산출.
     입력: 01-project-brief.md / RFP=https://realworld-docs.netlify.app/ -->

## 변경 이력

| Version | Date | Author | Change |
|---|---|---|---|
| v0.1 | 2026-05-15 | yongtae.cho@bespinglobal.com | 초안 — RealWorld 사양 타당성 검토 |

## 1. 시장·환경 검토

- **표준 벤치마크 존재** — RealWorld는 GitHub Stars 80k+, 150+ 구현체로 사실상 풀스택 비교 표준. 동일 API 사양·동일 UI 템플릿에 다중 스택을 매핑한다.
- **사양 안정성** — 공식 사양(`realworld-docs.netlify.app`)은 2014 발표, 최신 변경 2024/08(`articlesCount` body 제거). 사양 변경 빈도 < 1회/년 — 학습/검증 자산으로 안정.
- **상호운용 생태계** — 공인 API 적합도 검증 도구(공식 Postman Collection, Newman 스크립트)가 존재 — 적합도 측정에 외부 도구 의존 없음.
- **수요** — 사내 신규 FE/BE 스택 채택 시 “이걸로 한번 만들어 봐” 1순위 후보. 별도 시장성 분석 불필요(내부 dogfooding 목적).

## 2. 기술 타당성

- **표준 웹 스택만 요구** — JWT 인증, REST API, SPA, 마크다운 렌더, Bootstrap 4 UI. **특수 인프라(검색엔진/큐/스트리밍/ML) 불필요**.
- **데이터 모델 작음** — 5개 핵심 엔티티(User, Article, Comment, Tag, Follow/Favorite). 단일 RDB(PostgreSQL/MySQL/SQLite) 충분. NoSQL 불필요.
- **트래픽 가정** — 내부 dogfood 단계 단일 인스턴스(<100 RPS). 수평 확장·캐시 레이어·CDN 불필요(MVP).
- **빌드 도구** — 임의 FE 프레임워크(React/Vue/Svelte/Angular 등) + 임의 BE(Node/Python/Go/Rust/Java 등). 본 프로젝트 채택 스택은 **06 Architecture(/flow-design)에서 확정** — 본 단계에서는 “스택 자유도” 자체가 사양 특징.
- **검증 가능성** — 단위·통합·E2E 3축이 모두 구현 가능. 공식 Postman → BE 적합도, gstack `/qa` → FE 골든패스. Strict harness mode와 정합.

## 3. 비용·리소스 추정

- **인력** — 풀스택 개발 1.0 FTE × 약 3 sprint (1 sprint = 5 working days 가정) ≈ **15 working days**. 정확한 분해는 14 WBS에서.
- **인프라** — 개발: 로컬 Docker. 스테이징: 1 × small VM (2 vCPU / 4 GB) + 관리형 PostgreSQL 최소 사양 또는 SQLite. 월 비용 < $30 추정.
- **외부 서비스** — 0건(이메일/스토리지/검색/결제 비범위, §1.5).
- **라이선스** — RealWorld 사양 MIT. 본 구현체는 사내 정책에 따른다.
- **운영 비용(추정)** — MVP 종료 후 운영 단계로 넘기지 않을 수 있음(dogfood 산출). 운영 확정 시 별도 ADR.

## 4. 기대 효과

- **(직접)** 우리 팀 FE/BE 스택의 end-to-end 실증 1세트 확보 — 추후 신규 프로젝트 견적·기술 비교의 baseline.
- **(직접)** DevToolKit v6 자율개발 하네스의 NEW_PROJECT 1회 완주 — 강제·자동 흐름(`/flow-init`→`/flow-bootstrap`)이 RFP 1건으로 어디까지 가는지 dogfood 검증.
- **(부산물)** Postman/Newman 자동화 회귀 스위트 — API 회귀 0건 보장 도구로 재사용 가능.
- **(부산물)** 코딩 컨벤션·테스트 설계 reference — 후속 프로젝트의 06~13 산출 템플릿화.

## 5. 검토된 대안

| 대안 | 내용 | 채택 여부 | 사유 |
|---|---|---|---|
| **A. 자체 PRD로 작은 블로그를 새로 정의** | RealWorld 안 따르고 자체 사양 | ❌ 기각 | 비교 기준 상실 + 사양 작성 비용 증가 + 외부 호환 0 |
| **B. Todo 앱(전형 데모)** | 1주 내 끝나는 작은 데모 | ❌ 기각 | 인증·관계·페이지네이션·마크다운 등 “실서비스 구조” 검증 불가 (브리프 §2와 충돌) |
| **C. RealWorld Conduit 풀세트 구현(본 안)** | 공식 사양 100% (FE 7화면 + BE 19엔드포인트) | ✅ 채택 | 표준 벤치마크 + 외부 도구(Postman) 적합도 측정 + 사양 안정 + 비용 합리 |
| **D. RealWorld의 BE만 또는 FE만 구현** | 한쪽만 자체 구현, 반대쪽은 공식 reference | △ 보류 | MVP 가속 가능하나 본 프로젝트 목적(우리 풀스택 dogfood)에 부적합. 운영 단계 옵션으로 유지 |

## 6. 추천

- **C(풀세트 구현) 채택**. 본 RFP는 dogfood + reference 산출 목적에 부합하며, 기술/비용/일정 모두 통상 sprint 3회로 수렴 가능하다.
- **선제 결정(/flow-design 입력)**:
  1. 채택 스택은 06 Architecture(`/implementation-planner --mode=hld`)에서 결정. 본 단계는 “스택 자유”까지만.
  2. JWT 만료 정책·슬러그 규칙 등 [O-01, O-02, O-03, O-05]는 04 SRS 작성 중 보수적 기본값을 정한다.
  3. 외부 RealWorld FE 상호운용성 KPI(브리프 §4 마지막 행)는 MVP 안에 유지하되, 일정 압박 시 운영 단계로 deferral 가능 (Gate B에서 합의).
