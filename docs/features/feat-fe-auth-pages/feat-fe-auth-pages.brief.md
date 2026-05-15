---
doc_type: feature-brief
version: v0.1
status: Draft
author: yongtae.cho@bespinglobal.com
date: 2026-05-15
gate: feature
related:
  R-ID: [R-F-01, R-F-02]
  F-ID: [F-01]
  supersedes: null
---

# feat-fe-auth-pages — Feature Brief

## 변경 이력

| Version | Date | Author | Change |
|---|---|---|---|
| v0.1 | 2026-05-15 | yongtae.cho@bespinglobal.com | 초안 |

## 1. 한 줄 의도

LoginPage + RegisterPage + 공통 ErrorList. 성공 시 /로 redirect.

## 2. 사용자 가치

가입·로그인 UI.

## 3. 현재 상태 → 변경 후 상태

| 측면 | 현재 | 변경 후 |
|---|---|---|
| LoginPage | placeholder | 실 폼 |
| RegisterPage | placeholder | 실 폼 |
| ErrorList | 없음 | 공통 컴포넌트 |

## 4. 모드 자동 감지 결과

- mode: add
- 근거: ADR-0032 규칙 4 (type:feature)

## 5. 영향 범위

신규: pages/LoginPage·RegisterPage, components/ErrorList, 테스트.

## 6. 비목표

- HomePage → #20.

## 7. Open Questions

(없음)
