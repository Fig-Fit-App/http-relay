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

The SDK (`@figfit-oss/http-relay`) is **built** on every push/PR and **published to npm only on version tags** (`v0.1.0`, etc.) via [trusted publishing](https://docs.npmjs.com/trusted-publishers) (OIDC — no `NPM_TOKEN`).

On npmjs.com for `@figfit-oss/http-relay` → **Trusted Publisher**:

| Field | Value |
|-------|--------|
| Provider | GitHub Actions |
| Organization | `Fig-Fit-App` |
| Repository | `http-relay` |
| Workflow filename | `build-push.yml` |

```bash
# cut a release
git tag v0.1.0
git push origin v0.1.0
```

```bash
cd packages/sdk
npm run build
npm publish --access public
```
