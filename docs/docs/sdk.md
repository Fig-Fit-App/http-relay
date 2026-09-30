# SDK

Package: `@figfit-oss/http-relay`

```ts
import { createHttpRelayClient } from "@figfit-oss/http-relay"

const relay = createHttpRelayClient({
  baseUrl: process.env.HTTP_RELAY_URL!,
  token: process.env.HTTP_RELAY_TOKEN!,
})

const res = await relay.fetch({
  method: "POST",
  url: "https://example.com/v1/resource",
  headers: {
    Authorization: `Bearer ${process.env.UPSTREAM_TOKEN}`,
    "Content-Type": "application/json",
  },
  body: { hello: "world" },
})

const data = await res.json()
```

`fetchJson` is also available for a `{ status, data }` helper.
