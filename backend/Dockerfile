# Conduit backend — multi-stage build for production image
# Sprint 1 ISS-INFRA-01 부트스트랩 — 본 이미지는 docker compose config 통과만 책임.
# 실제 docker compose build/up 실증은 ISS-BE-INIT-* 이후 sprint 1 종료 시 smoke.

# --- builder ---
FROM node:20-alpine AS builder
WORKDIR /workspace

RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

COPY pnpm-workspace.yaml package.json tsconfig.base.json ./
COPY backend/package.json backend/tsconfig.json ./backend/
COPY frontend/package.json ./frontend/
COPY e2e/package.json ./e2e/

RUN pnpm install --filter @conduit/backend --frozen-lockfile || pnpm install --filter @conduit/backend

COPY backend/src ./backend/src
RUN pnpm --filter @conduit/backend build

# --- runtime ---
FROM node:20-alpine AS runtime
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

COPY --from=builder /workspace/backend/package.json ./
COPY --from=builder /workspace/backend/dist ./dist
COPY --from=builder /workspace/pnpm-workspace.yaml /workspace/package.json /tmp/

RUN pnpm install --prod --no-frozen-lockfile

ENV NODE_ENV=production
EXPOSE 3000

CMD ["node", "dist/server.js"]
