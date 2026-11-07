FROM oven/bun:1.3-slim AS deps
WORKDIR /app
COPY package.json bun.lock ./
COPY apps/service/package.json ./apps/service/
COPY packages/sdk/package.json ./packages/sdk/
RUN bun install --frozen-lockfile --production --ignore-scripts

FROM oven/bun:1.3-distroless AS runner
WORKDIR /app
ENV NODE_ENV=production HOME=/tmp

COPY --from=deps --chown=65532:65532 /app/node_modules ./node_modules
COPY --chown=65532:65532 package.json ./package.json
COPY --chown=65532:65532 apps/service/package.json ./apps/service/package.json
COPY --chown=65532:65532 apps/service/src ./apps/service/src

USER 65532:65532
WORKDIR /app/apps/service
EXPOSE 8787
CMD ["run", "src/index.ts"]
