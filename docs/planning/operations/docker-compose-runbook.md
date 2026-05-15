# docker-compose 운영 Runbook

> 본 문서는 `docker-compose.yml` 운영 시 점검·문제 해결 가이드. ISS-INFRA-01 부트스트랩 + Sprint 3 종료 시점.

## 실행

```bash
# .env 준비 (한 번)
cp .env.example .env
# 편집: JWT_SECRET을 openssl rand -base64 32 결과로 교체

# 전체 스택 부팅
docker compose up --build

# 백그라운드 (-d)
docker compose up -d --build

# 로그
docker compose logs -f backend
docker compose logs -f frontend

# 종료
docker compose down
# 볼륨 포함 정리 (DB 데이터 삭제)
docker compose down -v
```

## 헬스체크

- frontend: `curl http://localhost:80`
- backend: `curl http://localhost:3000/health` → `{"status":"ok"}`
- db: `docker compose exec db pg_isready -U conduit`

## 첫 실행 후

```bash
# Prisma 마이그레이션 (backend 컨테이너 내부)
docker compose exec backend pnpm prisma migrate deploy

# Seed
docker compose exec backend pnpm prisma:seed
```

## 문제 해결

| 증상 | 원인 | 해결 |
|---|---|---|
| backend 컨테이너 즉시 종료 | `JWT_SECRET` env 미주입 | `.env`에 32 byte+ 랜덤 추가 |
| `docker compose up` 권한 거부 | Docker Desktop WSL 통합 비활성 (Windows) | Docker Desktop 설정 → Resources → WSL Integration 활성 |
| Prisma migration 실패 | db 컨테이너 미부팅 | `docker compose logs db` 확인, healthcheck 통과 대기 |
| frontend nginx 502 | backend 미부팅 | `depends_on: condition: service_healthy` 정합 |
| dev에서 `.env` 미생성 | `.env.example` 사용했을 가능성 | `cp .env.example .env` 1회 |

## 보안

- `.env`는 git 제외 (`.gitignore`).
- `JWT_SECRET` 길이 ≥16 강제 (config/env.ts).
- prod에서 secret manager (AWS Secrets Manager, Vault) 활용 권고.

## CI 통합 (후속)

ISS-CI-01 BLOCKED 해소 후 `.github/workflows/ci.yml`의 newman + e2e job이 본 docker-compose를 사용 가능. compose up → seed → newman → e2e → down 순서.

## 변경 이력

| Version | Date | Author | Change |
|---|---|---|---|
| v0.1 | 2026-05-15 | yongtae.cho@bespinglobal.com | 초안 — ISS-OPS-09 |
