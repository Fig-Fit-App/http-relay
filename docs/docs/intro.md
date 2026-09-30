# Introduction

`http-relay` is a small Bun + Hono service that proxies HTTPS requests. Use it when a caller cannot reach an upstream host directly (network restrictions, regional blocks, or a single egress point).

## What it does

- Accepts `POST /v1/proxy` with `method`, `url`, optional `headers`, and optional `body`
- Requires `Authorization: Bearer <RELAY_TOKEN>`
- Forwards the request and returns the upstream status/body
- HTTPS only; optional host allowlist

## Packages

| Package | Path |
|---------|------|
| Service | `apps/service` |
| SDK | `packages/sdk` (`@figfit-oss/http-relay`) |
| Docs | `docs` |
