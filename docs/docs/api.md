# Proxy API

## `GET /health`

Returns `{ "ok": true }`.

## `POST /v1/proxy`

### Auth

```
Authorization: Bearer <RELAY_TOKEN>
```

Or `X-Relay-Token: <RELAY_TOKEN>`.

### Body

```json
{
  "method": "POST",
  "url": "https://example.com/v1/resource",
  "headers": {
    "Authorization": "Bearer <UPSTREAM_TOKEN>",
    "Content-Type": "application/json"
  },
  "body": { "hello": "world" }
}
```

| Field | Type | Notes |
|-------|------|-------|
| `method` | string | `GET` \| `POST` \| `PUT` \| `PATCH` \| `DELETE` \| `HEAD` |
| `url` | string | Absolute HTTPS URL |
| `headers` | object | Optional; hop-by-hop headers stripped |
| `body` | any | Optional; objects are JSON-serialized |

### Responses

- Upstream status/body are returned as-is when the relay accepts the request
- `401` — missing/invalid relay token
- `400` — invalid JSON / schema / non-HTTPS URL
- `403` — host not in `ALLOWED_HOSTS`
- `413` — body exceeds `MAX_BODY_BYTES`
- `502` / `504` — upstream failure / timeout
