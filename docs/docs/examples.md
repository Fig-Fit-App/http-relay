# Examples

## Arbitrary HTTPS upstream

Point the relay at any allowlisted host and pass through method, headers, and body:

```bash
curl -s -X POST "$RELAY_URL/v1/proxy" \
  -H "Authorization: Bearer $RELAY_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "method": "GET",
    "url": "https://httpbin.org/get",
    "headers": { "Accept": "application/json" }
  }'
```

## Restricting hosts

Set `ALLOWED_HOSTS` to a comma-separated list of hostnames. Requests to any other host return `403`. Leave it unset to allow any HTTPS host (less safe for public deployments).
