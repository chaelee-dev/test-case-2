# Conduit frontend — multi-stage build → nginx static serve
# Sprint 1 ISS-INFRA-01 부트스트랩 — 본 이미지는 docker compose config 통과만 책임.

# --- builder ---
FROM node:20-alpine AS builder
WORKDIR /workspace

RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

COPY pnpm-workspace.yaml package.json tsconfig.base.json ./
COPY frontend/package.json frontend/tsconfig.json frontend/vite.config.ts frontend/index.html ./frontend/
COPY backend/package.json ./backend/
COPY e2e/package.json ./e2e/

RUN pnpm install --filter @conduit/frontend --frozen-lockfile || pnpm install --filter @conduit/frontend

COPY frontend/src ./frontend/src
RUN pnpm --filter @conduit/frontend build

# --- runtime (nginx) ---
FROM nginx:alpine AS runtime
COPY --from=builder /workspace/frontend/dist /usr/share/nginx/html

EXPOSE 80

# /api → backend:3000 proxy는 ISS-CI-01·Sprint 3 배포 시 nginx.conf 추가 (현재 정적 서빙만)
CMD ["nginx", "-g", "daemon off;"]
