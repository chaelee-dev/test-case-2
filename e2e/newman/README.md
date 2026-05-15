# Newman 회귀 (RealWorld Postman 컬렉션)

## 현재 상태

본 폴더는 **placeholder 컬렉션**을 포함합니다 (health check 1건). 후속 follow-up 이슈에서 RealWorld 공식 23 케이스로 교체 예정.

## 실행

```bash
# 1. BE 띄우기
./devkit dev backend &

# 2. Newman 실행
pnpm --filter @conduit/e2e test:newman

# 환경변수로 URL 변경
BASE_URL=https://api.staging.conduit.example pnpm --filter @conduit/e2e test:newman
```

## 컬렉션 갱신

1. https://github.com/gothinkster/realworld/tree/main/api 에서 공식 컬렉션·환경 다운로드
2. `conduit.postman_collection.json` 교체
3. 환경 변수 (`baseUrl`, `email`, `password` 등) 확인
4. seed 데이터(`pnpm --filter @conduit/backend prisma:seed`) 후 23 케이스 PASS 검증

## CI 통합

ISS-CI-01 BLOCKED 해소 후 `.github/workflows/ci.yml`의 newman job이 본 컬렉션을 호출. 1건 실패 시 PR 머지 차단 (R-N-01, RISK-01·07).
