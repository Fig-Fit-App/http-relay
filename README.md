# @figfit-oss/http-relay

Generic authenticated HTTPS proxy (Bun + Hono). Forward a method, URL, headers, and body through a single relay endpoint.

**Version:** `0.1.0`

## Packages

| Path | Name | Role |
|------|------|------|
| `apps/service` | `@figfit-oss/http-relay-service` | Proxy API |
| `packages/sdk` | `@figfit-oss/http-relay` | Typed client |
| `docs` | Docusaurus | Documentation |

## Quick start

```bash
cd apps/service
cp .env.example .env
bun install
bun run dev
```

```bash
curl -s http://localhost:8787/health
curl -s -X POST http://localhost:8787/v1/proxy \
  -H "Authorization: Bearer $RELAY_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"method":"GET","url":"https://httpbin.org/get"}'
```

## Docker

```bash
# service (context = repo root)
docker build -f apps/service/Dockerfile -t http-relay-service .

# docs (context = docs/)
docker build -f docs/Dockerfile -t http-relay-docs docs
```

Images are built and pushed to GHCR on `main` and `v*` tags via GitHub Actions.

See `docs/` for the full API and SDK usage.
