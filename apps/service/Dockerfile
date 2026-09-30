# syntax=docker/dockerfile:1

FROM oven/bun:1.3 AS deps
WORKDIR /app

COPY package.json bun.lock ./
COPY apps/service/package.json ./apps/service/
COPY packages/sdk/package.json ./packages/sdk/

RUN bun install --frozen-lockfile

FROM oven/bun:1.3 AS runner
WORKDIR /app

ENV NODE_ENV=production

COPY --from=deps /app/node_modules ./node_modules
COPY package.json bun.lock tsconfig.json ./
COPY apps/service ./apps/service
COPY packages/sdk ./packages/sdk
COPY --from=deps /app/apps/service/node_modules ./apps/service/node_modules

EXPOSE 8787

WORKDIR /app/apps/service
CMD ["bun", "run", "src/index.ts"]
