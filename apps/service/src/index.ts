import { Hono } from "hono"
import { env } from "./env"
import { forwardProxy, ProxyError } from "./proxy"
import { ProxyRequestSchema } from "./schemas"

const app = new Hono()

app.get("/health", (c) => c.json({ ok: true }))

app.post("/v1/proxy", async (c) => {
  const auth = c.req.header("authorization")
  const token =
    auth?.startsWith("Bearer ") ? auth.slice("Bearer ".length) : c.req.header("x-relay-token")

  if (!token || token !== env.RELAY_TOKEN) {
    return c.json({ error: "unauthorized" }, 401)
  }

  let json: unknown
  try {
    json = await c.req.json()
  } catch {
    return c.json({ error: "invalid-json" }, 400)
  }

  const parsed = ProxyRequestSchema.safeParse(json)
  if (!parsed.success) {
    return c.json({ error: "invalid-request", details: parsed.error.flatten() }, 400)
  }

  try {
    const upstream = await forwardProxy(parsed.data)
    return upstream
  } catch (err) {
    if (err instanceof ProxyError) {
      return c.json({ error: err.message }, err.status as 400)
    }
    return c.json({ error: "proxy-failed" }, 500)
  }
})

console.log(`http-relay listening on :${env.PORT}`)
export default {
  port: env.PORT,
  fetch: app.fetch,
}
