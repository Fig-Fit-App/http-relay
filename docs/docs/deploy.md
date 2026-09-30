# Deploy

## Environment

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `RELAY_TOKEN` | yes | — | Bearer token for `/v1/proxy` |
| `PORT` | no | `8787` | Listen port |
| `ALLOWED_HOSTS` | no | (any HTTPS) | Comma-separated host allowlist |
| `REQUEST_TIMEOUT_MS` | no | `30000` | Upstream timeout |
| `MAX_BODY_BYTES` | no | `1048576` | Max proxied body size |

## Run

```bash
cd apps/service
cp .env.example .env
bun install
bun run start
```

Expose the service over HTTPS. Callers set their relay base URL and token accordingly.
